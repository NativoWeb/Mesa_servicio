# Mesa de Servicio TI — SaaS Multitenant

## Proyecto
Sistema de Mesa de Servicio (Service Desk) e Inventario TI para instituciones educativas.
Cliente inicial: Unidades Tecnologicas de Santander (UTS).
Arquitectura SaaS multitenant — cada institucion es un tenant con schema propio en PostgreSQL.

## Stack

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Backend | Laravel | 11.x |
| PHP | PHP | 8.2+ |
| Frontend | Next.js + React | 15.x / 19.x |
| UI Components | shadcn/ui + Tailwind CSS | latest |
| Base de datos | PostgreSQL | 16+ |
| Multitenancy | stancl/tenancy | 3.x |
| RBAC | spatie/laravel-permission | 6.x |
| Auth API | Laravel Sanctum | built-in |
| Audit | spatie/laravel-activitylog | 4.x |
| Reportes | maatwebsite/excel + barryvdh/laravel-dompdf | latest |
| State management | Zustand | 5.x |
| Data fetching | TanStack React Query | 5.x |
| Graficas | Recharts | 2.x |
| Iconos | Lucide React | latest |

## Estructura del monorepo

```
mesa-de-ayuda-uts/
├── backend/          # Laravel API (PHP)
├── frontend/         # Next.js SPA (TypeScript)
├── docs/             # Documentacion del proyecto
└── CLAUDE.md         # Este archivo
```

## Modulos del sistema

1. **Dashboard** — KPIs, graficas, alertas SLA, carga por tecnico (vistas por rol)
2. **Tickets** — CRUD, asignacion, escalamiento, conversacion, timeline de eventos
3. **Inventario de Activos** — CRUD equipos, hoja de vida, specs, garantia
4. **Mantenimientos** — Registro preventivo/correctivo, calendario, alertas
5. **Asignacion y Turnos** — Asignacion manual/auto, calendario semanal, carga
6. **Mensajeria Masiva** — Email/SMS, plantillas, segmentacion, historial
7. **Reportes** — Tickets por tecnico, activos por sede, SLA, mantenimientos, actividad
8. **Administracion** — Usuarios/Roles (RBAC), config SLA, SMTP/SMS, backup, logs auditoria

## Roles (RBAC)

| Rol | Slug | Acceso |
|-----|------|--------|
| Administrador del Sistema | `admin` | Acceso total, config sistema |
| Lider TIC | `it_leader` | Dashboard global, reasignar/escalar, reportes, mensajeria |
| Tecnico de Soporte | `technician` | Tickets asignados, equipos vinculados, turnos |
| Gestor de Inventario | `inventory_manager` | CRUD activos, mantenimientos, cuentadantes |
| Usuario Final | `end_user` | Crear/ver tickets propios, notificaciones |
| Cuentadante | `asset_holder` | Ver equipos a cargo, hoja de vida, alertas |

## Sedes (campuses)

Bucaramanga (Principal), Piedecuesta, Barrancabermeja, Yopal, Velez, Charala

## Multitenancy

- Estrategia: **Schema por tenant** en PostgreSQL
- Package: `stancl/tenancy`
- Cada institucion tiene su propio schema con tablas de tickets, assets, users, etc.
- Tablas centrales (tenants, domains, plans) viven en el schema `public`
- Identificacion de tenant por dominio/subdominio

## Convenciones de codigo

### Backend (Laravel/PHP)
- Nombres de clases, metodos, variables: **ingles**
- Comentarios: espanol donde sea necesario para logica de negocio
- Controllers: `App\Http\Controllers\Api\{Resource}Controller`
- Models: `App\Models\{Resource}`
- Enums: `App\Enums\{Name}` (PHP 8.1 backed enums)
- Migraciones tenant: `database/migrations/tenant/`
- Form Requests para validacion
- API Resources para respuestas JSON

### Frontend (Next.js/TypeScript)
- Rutas por rol: `/lider/`, `/tecnico/`, `/usuario/`, `/cuentadante/`, `/inventario/`, `/admin/`
- Componentes: PascalCase, archivos kebab-case
- Tipos: `src/types/{resource}.ts`
- Hooks: `src/hooks/use-{resource}.ts`
- Store: Zustand en `src/stores/`
- API client: Axios en `src/lib/api.ts`
- UI labels y textos: **espanol** (es la interfaz para usuario final)

## Comandos

### Backend
```bash
cd backend
php artisan serve                    # Servidor dev
php artisan migrate                  # Migraciones centrales
php artisan tenants:migrate          # Migraciones por tenant
php artisan tenants:seed             # Seeders por tenant
composer test                        # Tests
```

### Frontend
```bash
cd frontend
npm run dev                          # Servidor dev (localhost:3000)
npm run build                        # Build produccion
npm run lint                         # Linter
```

## Paleta de colores (del mockup UTS)

- Verde institucional UTS: `#1B5E20` (dark), `#4CAF50` (medium), `#C8E6C9` (light)
- Amarillo/dorado acentos: `#F9A825`, `#CDDC39`
- Fondo: `#FAFAFA` (light), `#FFFFFF` (cards)
- Texto: `#1A1A1A` (primary), `#6B7280` (secondary)
- Estados: Rojo critico `#D32F2F`, Naranja alto `#F57C00`, Amarillo medio `#FBC02D`, Verde ok `#388E3C`
- Sidebar: gradiente verde oscuro `#1B3A1B` → `#2E5A2E`

## API Base URL

- Dev: `http://localhost:8000/api`
- Frontend dev: `http://localhost:3000`

## Variables de entorno

### Backend (.env)
```
DB_CONNECTION=pgsql
DB_DATABASE=mesa_ayuda_uts
TENANCY_DATABASE_AUTO_CREATE=true
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Mesa de Servicio TI
```
