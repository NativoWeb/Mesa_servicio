#!/usr/bin/env bash
# Redespliegue de Mesa de Ayuda UTS al servidor EC2.
# Se corre desde TU PC (Git Bash), en la raiz del repo:
#
#   ./deploy/deploy.sh                    # despliega el commit actual (HEAD)
#   ./deploy/deploy.sh main               # despliega otra rama/commit
#   ./deploy/deploy.sh --provision --seed # primera vez: prepara el servidor y carga datos demo
#
# Solo sube lo que esta COMMITEADO (usa git archive): nunca sube .env, vendor ni node_modules.
set -euo pipefail

SSH_KEY="${SSH_KEY:-$HOME/.ssh/mesa-ayuda-uts-key.pem}"
DEPLOY_HOST="${DEPLOY_HOST:-ec2-user@18.225.227.5}"
REF=HEAD
PROVISION=0
SEED=0

for arg in "$@"; do
    case "$arg" in
        --provision) PROVISION=1 ;;
        --seed) SEED=1 ;;
        -h|--help) sed -n '2,10p' "$0"; exit 0 ;;
        *) REF="$arg" ;;
    esac
done

cd "$(git rev-parse --show-toplevel)"
SHA="$(git rev-parse --short "$REF")"
if [ -n "$(git status --porcelain -- backend frontend deploy)" ]; then
    echo "AVISO: tienes cambios sin commitear en backend/frontend/deploy; NO se van a subir."
fi

SSH=(ssh -i "$SSH_KEY" -o ConnectTimeout=20 "$DEPLOY_HOST")

echo "==> Subiendo commit $SHA"
git archive --format=tar "$REF" backend frontend deploy | gzip -c \
    | "${SSH[@]}" 'rm -rf /tmp/mesa-release && mkdir -p /tmp/mesa-release && tar -xzf - -C /tmp/mesa-release'

if [ "$PROVISION" -eq 1 ]; then
    echo "==> Preparando servidor (provision.sh)"
    "${SSH[@]}" 'sudo bash /tmp/mesa-release/deploy/provision.sh'
fi

"${SSH[@]}" "SHA='$SHA' SEED='$SEED' bash -s" <<'REMOTE'
set -Eeuo pipefail
APP_DIR=/var/www/mesa-ayuda
REL=/tmp/mesa-release
FRONT="$APP_DIR/frontend"
STAGING="$APP_DIR/frontend-staging"
PREV="$APP_DIR/frontend-prev"
ARTISAN=(sudo -u nginx php artisan)
BACKEND_DOWN=0

# Si algo falla: saca el backend de mantenimiento, restaura el frontend anterior
# si quedo a medio cambiar y vuelve a levantar Next.
on_error() {
    local code=$? line=$1
    trap - ERR
    set +e
    echo "" >&2
    echo "!!! ERROR en la linea $line del bloque remoto (codigo $code). Despliegue DETENIDO." >&2
    if [ "$BACKEND_DOWN" = "1" ]; then
        (cd "$APP_DIR/backend" && "${ARTISAN[@]}" up)
        echo "!!! Backend fuera de modo mantenimiento (artisan up)." >&2
    fi
    if [ ! -d "$FRONT" ] && [ -d "$PREV" ]; then
        mv "$PREV" "$FRONT"
        echo "!!! Frontend anterior restaurado." >&2
    fi
    sudo systemctl start mesa-ayuda-next
    echo "!!! mesa-ayuda-next: $(systemctl is-active mesa-ayuda-next)" >&2
    echo "!!! Revisa el error de arriba, corrige, commitea y vuelve a correr deploy.sh." >&2
    exit "$code"
}
trap 'on_error $LINENO' ERR

if [ ! -f "$APP_DIR/backend/.env" ]; then
    echo "Falta $APP_DIR/backend/.env. Corre primero: ./deploy/deploy.sh --provision" >&2
    exit 1
fi

echo "==> Configs de nginx, php-fpm y systemd"
rsync -a --delete "$REL/deploy/" "$APP_DIR/deploy/"
id mesa-next >/dev/null 2>&1 || sudo useradd --system --no-create-home --home-dir /nonexistent --shell /sbin/nologin mesa-next
sudo install -m 644 "$APP_DIR/deploy/nginx/nginx.conf" /etc/nginx/nginx.conf
sudo install -m 644 "$APP_DIR/deploy/nginx/mesa-ayuda.conf" /etc/nginx/conf.d/mesa-ayuda.conf
sudo install -m 644 "$APP_DIR/deploy/php-fpm/mesa-ayuda.conf" /etc/php-fpm.d/mesa-ayuda.conf
for unit in mesa-ayuda-queue.service mesa-ayuda-scheduler.service mesa-ayuda-scheduler.timer mesa-ayuda-next.service; do
    sudo install -m 644 "$APP_DIR/deploy/systemd/$unit" "/etc/systemd/system/$unit"
done
sudo systemctl daemon-reload
sudo nginx -t
sudo php-fpm -t

# El frontend se compila en un directorio aparte mientras la version actual sigue
# sirviendo. Solo si el build pasa se cambia de directorio (segundos sin servicio).
echo "==> Frontend: npm ci + build en $STAGING"
sudo rm -rf "$STAGING"
rsync -a --exclude '/node_modules/' --exclude '/.next/' "$REL/frontend/" "$STAGING/"
cp "$APP_DIR/deploy/frontend.env.production" "$STAGING/.env.production"
(
    trap - ERR
    cd "$STAGING"
    npm ci --no-audit --no-fund --loglevel=error
    NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 npm run build
)

echo "==> Backend: modo mantenimiento"
cd "$APP_DIR/backend"
if [ -f vendor/autoload.php ]; then
    "${ARTISAN[@]}" down --retry=30
    BACKEND_DOWN=1
fi

echo "==> Backend: codigo, carpetas y permisos"
rsync -a --delete \
    --exclude '/.env' \
    --exclude '/storage/' \
    --exclude '/vendor/' \
    --exclude '/bootstrap/cache/' \
    "$REL/backend/" "$APP_DIR/backend/"
sudo mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions \
    storage/framework/views storage/framework/testing storage/logs bootstrap/cache
sudo chown -R nginx:nginx storage bootstrap/cache
sudo chmod -R u+rwX,g+rwX,o-rwx storage bootstrap/cache

echo "==> Backend: composer"
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts --no-progress
"${ARTISAN[@]}" package:discover --ansi

echo "==> Backend: migraciones y caches"
"${ARTISAN[@]}" migrate --force
if [ "$SEED" = "1" ]; then
    "${ARTISAN[@]}" db:seed --force
fi
"${ARTISAN[@]}" optimize:clear
"${ARTISAN[@]}" config:cache
"${ARTISAN[@]}" route:cache
"${ARTISAN[@]}" view:cache
"${ARTISAN[@]}" up
BACKEND_DOWN=0

echo "==> Frontend: activando el build nuevo"
sudo systemctl stop mesa-ayuda-next
sudo rm -rf "$PREV"
if [ -d "$FRONT" ]; then mv "$FRONT" "$PREV"; fi
mv "$STAGING" "$FRONT"
mkdir -p "$FRONT/.next/cache"
sudo chown -R mesa-next:mesa-next "$FRONT/.next/cache"
sudo systemctl start mesa-ayuda-next
sudo rm -rf "$PREV"
echo "$SHA" > "$APP_DIR/REVISION"

echo "==> Reiniciando servicios"
sudo systemctl enable --now postgresql php-fpm nginx mesa-ayuda-queue mesa-ayuda-next mesa-ayuda-scheduler.timer >/dev/null
sudo systemctl reload php-fpm
sudo systemctl reload nginx
(trap - ERR; cd "$APP_DIR/backend" && "${ARTISAN[@]}" queue:restart)
sudo systemctl restart mesa-ayuda-queue

ok=0
for i in $(seq 1 30); do
    if curl -fsS -o /dev/null http://127.0.0.1:3000/login; then ok=1; break; fi
    sleep 1
done
[ "$ok" = "1" ] || { echo "Next no responde en 127.0.0.1:3000" >&2; false; }

echo "==> Estado de servicios"
systemctl is-active nginx php-fpm postgresql mesa-ayuda-queue mesa-ayuda-next mesa-ayuda-scheduler.timer
echo "==> Desplegado $SHA"
REMOTE
