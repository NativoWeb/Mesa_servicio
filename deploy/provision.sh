#!/usr/bin/env bash
# Preparacion del servidor (Amazon Linux 2023). Se corre UNA vez, pero es
# seguro repetirlo: cada paso revisa si ya esta hecho.
# Lo ejecuta deploy.sh con --provision:  sudo bash provision.sh
set -euo pipefail

APP_DIR=/var/www/mesa-ayuda
DEPLOY_SRC="$(cd "$(dirname "$0")" && pwd)"
DB_NAME=mesa_ayuda_uts
DB_USER=mesa_ayuda

if [ "$(id -u)" -ne 0 ]; then
    echo "Ejecuta este script con sudo" >&2
    exit 1
fi

echo "==> Swap de 2 GB"
if ! swapon --show | grep -q /swapfile; then
    [ -f /swapfile ] || dd if=/dev/zero of=/swapfile bs=1M count=2048 status=none
    chmod 600 /swapfile
    mkswap /swapfile >/dev/null
    swapon /swapfile
fi
grep -q '^/swapfile' /etc/fstab || echo '/swapfile swap swap defaults 0 0' >> /etc/fstab

echo "==> Zona horaria America/Bogota"
timedatectl set-timezone America/Bogota

echo "==> Paquetes"
dnf install -y -q \
    php8.3 php8.3-cli php8.3-fpm php8.3-common php8.3-pgsql php8.3-pdo php8.3-mbstring \
    php8.3-xml php8.3-gd php8.3-zip php8.3-intl php8.3-bcmath php8.3-opcache php8.3-process \
    php8.3-sodium postgresql16-server postgresql16 nginx nodejs20 nodejs20-npm git unzip rsync

echo "==> Composer"
if ! command -v composer >/dev/null 2>&1 && [ ! -x /usr/local/bin/composer ]; then
    tmp="$(mktemp -d)"
    expected="$(curl -fsSL https://composer.github.io/installer.sig)"
    curl -fsSL https://getcomposer.org/installer -o "$tmp/composer-setup.php"
    actual="$(php -r "echo hash_file('sha384', '$tmp/composer-setup.php');")"
    if [ "$expected" != "$actual" ]; then
        echo "El hash del instalador de Composer no coincide" >&2
        rm -rf "$tmp"
        exit 1
    fi
    php "$tmp/composer-setup.php" --quiet --install-dir=/usr/local/bin --filename=composer
    rm -rf "$tmp"
fi

echo "==> PostgreSQL 16 (solo localhost)"
PGDATA=/var/lib/pgsql/data
[ -f "$PGDATA/PG_VERSION" ] || postgresql-setup --initdb
sed -i "s/^#\?listen_addresses = .*/listen_addresses = 'localhost'/" "$PGDATA/postgresql.conf"
sed -i -E 's#^(host\s+all\s+all\s+127\.0\.0\.1/32\s+)ident#\1scram-sha-256#; s#^(host\s+all\s+all\s+::1/128\s+)ident#\1scram-sha-256#' "$PGDATA/pg_hba.conf"
systemctl enable postgresql
systemctl restart postgresql

echo "==> Carpetas de la app"
mkdir -p "$APP_DIR/backend" "$APP_DIR/frontend"
chown ec2-user:ec2-user "$APP_DIR" "$APP_DIR/backend" "$APP_DIR/frontend"

ENV_FILE="$APP_DIR/backend/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "==> Creando backend/.env de produccion con contrasena de BD aleatoria"
    db_pass="$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c 40)"
    app_key="base64:$(openssl rand -base64 32)"
    sudo -u postgres psql -v ON_ERROR_STOP=1 -q -v pass="$db_pass" <<'SQL'
SELECT format('CREATE ROLE mesa_ayuda LOGIN PASSWORD %L', :'pass')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mesa_ayuda') \gexec
SELECT format('ALTER ROLE mesa_ayuda PASSWORD %L', :'pass') \gexec
SQL
    sed -e "s#^APP_KEY=.*#APP_KEY=${app_key}#" \
        -e "s#^DB_PASSWORD=.*#DB_PASSWORD=${db_pass}#" \
        "$DEPLOY_SRC/.env.production.example" > "$ENV_FILE"
    unset db_pass app_key
fi
chown ec2-user:nginx "$ENV_FILE"
chmod 640 "$ENV_FILE"

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
    sudo -u postgres createdb -O "$DB_USER" -E UTF8 "$DB_NAME"
fi

echo "==> PHP-FPM (pool propio, se desactiva el pool www por defecto)"
install -m 644 "$DEPLOY_SRC/php-fpm/mesa-ayuda.conf" /etc/php-fpm.d/mesa-ayuda.conf
[ -f /etc/php-fpm.d/www.conf ] && mv /etc/php-fpm.d/www.conf /etc/php-fpm.d/www.conf.disabled
php-fpm -t
systemctl enable php-fpm

echo "==> Nginx"
install -m 644 "$DEPLOY_SRC/nginx/mesa-ayuda.conf" /etc/nginx/conf.d/mesa-ayuda.conf
nginx -t
systemctl enable nginx

echo "==> Servicios systemd propios"
for unit in mesa-ayuda-queue.service mesa-ayuda-scheduler.service mesa-ayuda-scheduler.timer mesa-ayuda-next.service; do
    install -m 644 "$DEPLOY_SRC/systemd/$unit" "/etc/systemd/system/$unit"
done
systemctl daemon-reload
systemctl enable mesa-ayuda-queue.service mesa-ayuda-next.service mesa-ayuda-scheduler.timer

echo "==> Provision terminada"
