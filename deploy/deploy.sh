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
set -euo pipefail
APP_DIR=/var/www/mesa-ayuda
REL=/tmp/mesa-release
ARTISAN=(sudo -u nginx php artisan)

if [ ! -f "$APP_DIR/backend/.env" ]; then
    echo "Falta $APP_DIR/backend/.env. Corre primero: ./deploy/deploy.sh --provision" >&2
    exit 1
fi

echo "==> Sincronizando codigo"
rsync -a --delete \
    --exclude '/backend/.env' \
    --exclude '/backend/storage/' \
    --exclude '/backend/vendor/' \
    --exclude '/backend/bootstrap/cache/' \
    --exclude '/backend/public/storage' \
    --exclude '/frontend/node_modules/' \
    --exclude '/frontend/.next/' \
    --exclude '/frontend/.env.production' \
    "$REL/" "$APP_DIR/"
echo "$SHA" > "$APP_DIR/REVISION"

echo "==> Configs de nginx, php-fpm y systemd"
sudo install -m 644 "$APP_DIR/deploy/nginx/mesa-ayuda.conf" /etc/nginx/conf.d/mesa-ayuda.conf
sudo install -m 644 "$APP_DIR/deploy/php-fpm/mesa-ayuda.conf" /etc/php-fpm.d/mesa-ayuda.conf
for unit in mesa-ayuda-queue.service mesa-ayuda-scheduler.service mesa-ayuda-scheduler.timer mesa-ayuda-next.service; do
    sudo install -m 644 "$APP_DIR/deploy/systemd/$unit" "/etc/systemd/system/$unit"
done
sudo systemctl daemon-reload
sudo nginx -t
sudo php-fpm -t

echo "==> Backend: carpetas y permisos"
cd "$APP_DIR/backend"
mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions \
    storage/framework/views storage/framework/testing storage/logs bootstrap/cache
sudo chown -R nginx:nginx storage bootstrap/cache
sudo chmod -R u+rwX,g+rwX,o-rwx storage bootstrap/cache
ln -sfn ../storage/app/public public/storage

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

echo "==> Frontend: npm ci + build"
cd "$APP_DIR/frontend"
cp "$APP_DIR/deploy/frontend.env.production" .env.production
# Se detiene Next durante el build para liberar RAM (t3.small)
sudo systemctl stop mesa-ayuda-next || true
npm ci --no-audit --no-fund --loglevel=error
NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 npm run build

echo "==> Reiniciando servicios"
sudo systemctl enable --now postgresql php-fpm nginx mesa-ayuda-queue mesa-ayuda-next mesa-ayuda-scheduler.timer >/dev/null
sudo systemctl reload php-fpm
sudo systemctl reload nginx
"${ARTISAN[@]}" queue:restart
sudo systemctl restart mesa-ayuda-queue mesa-ayuda-next

for i in $(seq 1 30); do
    if curl -fsS -o /dev/null http://127.0.0.1:3000/; then break; fi
    sleep 1
done
echo "==> Estado de servicios"
systemctl is-active nginx php-fpm postgresql mesa-ayuda-queue mesa-ayuda-next mesa-ayuda-scheduler.timer
echo "==> Desplegado $SHA"
REMOTE
