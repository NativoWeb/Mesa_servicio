# Despliegue en AWS EC2 (Mesa de Ayuda UTS)

Guia en español sencillo para poner la app en el servidor y volver a desplegarla
cuando hagas cambios.

## 1. Como esta armado el servidor

Todo vive en **una sola maquina EC2** (Amazon Linux 2023, t3.small, IP `18.225.227.5`):

```
Navegador ──> Nginx :80
               ├── /api/*, /sanctum/*, /up ──> PHP-FPM ──> Laravel (backend/public)
               ├── /storage/*              ──> archivos publicos de Laravel
               └── todo lo demas           ──> Next.js (next start en 127.0.0.1:3000)

Laravel ──> PostgreSQL 16 (solo escucha en 127.0.0.1:5432)
```

| Pieza | Servicio systemd | Que hace |
|-------|------------------|----------|
| Nginx | `nginx` | Recibe todo el trafico del puerto 80 y lo reparte |
| PHP-FPM | `php-fpm` | Ejecuta Laravel (pool `mesa-ayuda`, usuario `nginx`) |
| PostgreSQL | `postgresql` | Base de datos `mesa_ayuda_uts`, usuario `mesa_ayuda` |
| Next.js | `mesa-ayuda-next` | El frontend (`next start -p 3000`) |
| Colas | `mesa-ayuda-queue` | `php artisan queue:work` (se reinicia solo si se cae) |
| Scheduler | `mesa-ayuda-scheduler.timer` | Corre `php artisan schedule:run` cada minuto |

Todos estan "enabled": arrancan solos cuando el servidor se reinicia.

La app queda en `/var/www/mesa-ayuda` (carpetas `backend/` y `frontend/`).
El servidor tiene 2 GB de swap (`/swapfile`) porque 2 GB de RAM no alcanzan para compilar Next.js.
La hora del sistema y del scheduler es America/Bogota (el reporte diario sale a las 08:00 hora Colombia).
Laravel guarda las fechas en UTC (como en desarrollo).

## 2. Archivos de esta carpeta

| Archivo | Para que sirve | Donde termina en el servidor |
|---------|----------------|------------------------------|
| `deploy.sh` | Sube el codigo y redespliega (lo corres en tu PC) | — |
| `provision.sh` | Prepara un servidor nuevo (paquetes, swap, BD...) | — |
| `nginx/mesa-ayuda.conf` | Reglas de Nginx | `/etc/nginx/conf.d/` |
| `php-fpm/mesa-ayuda.conf` | Pool de PHP-FPM | `/etc/php-fpm.d/` |
| `systemd/*.service`, `*.timer` | Servicios propios | `/etc/systemd/system/` |
| `.env.production.example` | Plantilla del `.env` del backend (sin secretos) | `/var/www/mesa-ayuda/backend/.env` |
| `frontend.env.production` | Variables publicas del frontend (`NEXT_PUBLIC_API_URL=/api`) | `/var/www/mesa-ayuda/frontend/.env.production` |

## 3. Requisitos en tu PC

- Git Bash.
- La llave SSH en `C:\Users\<tu usuario>\.ssh\mesa-ayuda-uts-key.pem`.
- El *security group* de AWS debe permitir SSH (puerto 22) **desde tu IP actual**.
  Si cambias de red o tu IP cambia, el SSH deja de conectar: entra a la consola de AWS →
  EC2 → Security Groups → edita la regla del puerto 22 con "My IP".

Prueba la conexion:

```bash
ssh -i ~/.ssh/mesa-ayuda-uts-key.pem ec2-user@18.225.227.5
```

## 4. Primera vez (servidor nuevo y vacio)

Desde la raiz del repo, en Git Bash:

```bash
./deploy/deploy.sh --provision --seed
```

Eso hace, en orden:

1. Empaqueta el commit actual con `git archive` (solo lo commiteado; nunca sube `.env`,
   `vendor/` ni `node_modules/`) y lo copia al servidor por SSH.
2. `provision.sh`: swap, zona horaria, instala PHP 8.3, PostgreSQL 16, Nginx, Node 20 y
   Composer (verificando su firma), crea la BD y el usuario con una **contraseña aleatoria**
   que solo queda escrita en `/var/www/mesa-ayuda/backend/.env` (permisos 640).
   También genera el `APP_KEY`.
3. El despliegue normal (punto 5) y además `php artisan db:seed --force`
   (usuarios demo, contraseña `password`).

## 5. Redesplegar despues de un cambio

1. Haz commit de tus cambios (lo que no este commiteado **no se sube**).
2. Corre:

```bash
./deploy/deploy.sh          # despliega HEAD (tu rama actual)
./deploy/deploy.sh main     # o una rama / commit concreto
```

El script es seguro de repetir. Hace:

- Sincroniza el codigo en `/var/www/mesa-ayuda` (sin tocar `.env`, `storage/`, `vendor/`).
- Copia las configs de Nginx, PHP-FPM y systemd.
- `composer install --no-dev -o`, `php artisan migrate --force`, cachea config/rutas/vistas.
- `npm ci` + `npm run build` del frontend.
- Reinicia Next.js, el worker de colas y recarga PHP-FPM y Nginx.

Mientras compila Next.js (2-4 minutos) el frontend no responde: hazlo en horas de poco uso.

**No uses `--seed` en redespliegues**: vuelve a correr los seeders sobre datos reales.

## 6. Comandos utiles en el servidor

```bash
ssh -i ~/.ssh/mesa-ayuda-uts-key.pem ec2-user@18.225.227.5

# Estado de todo
systemctl is-active nginx php-fpm postgresql mesa-ayuda-queue mesa-ayuda-next mesa-ayuda-scheduler.timer

# Logs
sudo journalctl -u mesa-ayuda-next -n 100        # frontend
sudo journalctl -u mesa-ayuda-queue -n 100       # colas
sudo tail -n 100 /var/www/mesa-ayuda/backend/storage/logs/laravel-$(date +%F).log
sudo tail -n 100 /var/log/nginx/error.log

# Artisan (siempre como usuario nginx, que es el dueño de storage/)
cd /var/www/mesa-ayuda/backend
sudo -u nginx php artisan schedule:list
sudo -u nginx php artisan queue:failed

# Reiniciar algo
sudo systemctl restart mesa-ayuda-next
sudo systemctl restart mesa-ayuda-queue

# Que commit esta desplegado
cat /var/www/mesa-ayuda/REVISION
```

Si cambias algo en `backend/.env` del servidor, recarga la cache de config:

```bash
cd /var/www/mesa-ayuda/backend && sudo -u nginx php artisan config:cache && sudo systemctl restart mesa-ayuda-queue
```

## 7. Pendiente / siguientes pasos

- **HTTPS y dominio**: hoy es solo `http://`. Con un dominio apuntando a la IP se instala
  certbot (`sudo dnf install certbot python3-certbot-nginx`) y se actualiza `APP_URL` y
  `CORS_ALLOWED_ORIGINS`. Ojo: los tokens viajan sin cifrar mientras no haya HTTPS.
- **IP fija**: si la instancia se detiene y se vuelve a encender, AWS puede cambiar la IP
  publica. Para evitarlo asigna una *Elastic IP* desde la consola.
- **Correo real**: hoy `MAIL_MAILER=log` (los correos se escriben en el log).
- **Respaldos de la BD**: no hay. Un `pg_dump` diario o snapshots del disco EBS desde la consola.
- **Usuarios demo**: tienen contraseña `password`. Cambialas antes de dar acceso real.
