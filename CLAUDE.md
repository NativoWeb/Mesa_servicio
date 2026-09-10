# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SaaS multi-tenant Service Desk & IT Inventory system for educational institutions.
Monorepo: Laravel 12 API backend + Next.js 16 SPA frontend.
Initial client: Unidades Tecnologicas de Santander (UTS).

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 12 / PHP 8.2+ |
| Frontend | Next.js 16 / React 19 / TypeScript |
| UI | shadcn/ui + Tailwind CSS 4 |
| Database | PostgreSQL 16+ |
| Auth | Laravel Sanctum (Bearer token) |
| RBAC | spatie/laravel-permission 6.x |
| Multitenancy | stancl/tenancy 3.x (installed, not yet active on API routes) |
| State | Zustand 5 (persisted to localStorage) |
| Data fetching | TanStack React Query 5 |
| Charts | Recharts 3 |

## Commands

### Backend
```bash
cd backend
composer install
cp .env.example .env               # First time: configure DB_* for PostgreSQL
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve --port=8000       # Dev server

php artisan tenants:migrate         # Tenant schema migrations (not active yet)
php artisan tenants:seed

./vendor/bin/pint                   # Code formatting (Laravel Pint)
php artisan test                    # PHPUnit (uses SQLite in-memory)
php artisan test --filter=TestName  # Single test
php artisan optimize:clear          # Clear all caches
```

### Frontend
```bash
cd frontend
npm install
npm run dev                         # Dev server (localhost:3000)
npm run build                       # Production build
npm run lint                        # ESLint
```

### Environment Variables

Backend `.env`: `DB_CONNECTION=pgsql`, `DB_DATABASE=mesa_ayuda_uts`
Frontend `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000/api`

### Test Users (all password: `password`)

| Role | Email | Route prefix |
|------|-------|-------------|
| admin | admin@demo.servicedesk.com | /admin |
| it_leader | lider@demo.servicedesk.com | /lider |
| technician | tecnico@demo.servicedesk.com | /tecnico |
| inventory_manager | inventario@demo.servicedesk.com | /inventario |
| end_user | usuario@demo.servicedesk.com | /usuario |
| asset_holder | cuentadante@demo.servicedesk.com | /cuentadante |

## Architecture

### Backend Structure

```
backend/
  routes/api.php              # All API endpoints (auth:sanctum)
  routes/tenant.php           # Tenant routes (placeholder, not active)
  app/Http/Controllers/Api/   # AuthController, TicketController, AssetController,
                              # MaintenanceController, UserController, DashboardController,
                              # ShiftController, MessageController, ReportController
  app/Models/                 # User, Ticket, Asset, Maintenance, Shift, MassMessage,
                              # Comment, Attachment, TicketEvent, SlaConfig, AuditLog
  app/Enums/                  # TicketStatus, TicketPriority, UserRole, AssetStatus,
                              # AssetCategory, MaintenanceType (PHP 8.1 backed enums)
  app/Services/               # SlaService, TicketAssignmentService, ReportService,
                              # NotificationService (exist but NOT injected into controllers)
  database/migrations/        # Central migrations
  database/migrations/tenant/ # Tenant mirrors (ready for activation)
```

**API routes** (`routes/api.php`): All under `auth:sanctum` except `POST /api/auth/login`.
Resources: `tickets`, `assets`, `maintenances`, `users`, `shifts`, `messages`, `reports`, `dashboard`.

**Auth flow**: `POST /api/auth/login` validates credentials, returns `{ user, token }` via Sanctum `createToken()`. Token never expires. No CSRF cookie needed — pure Bearer token auth.

**Models use polymorphic relations**: `comments` and `attachments` are morphable to Ticket, Asset, and Maintenance. Ticket and Asset use `SoftDeletes`.

**Validation**: Inline `$request->validate()` in controllers (no Form Request classes yet).

### Frontend Structure

```
frontend/src/
  app/(auth)/login/           # Login page
  app/(dashboard)/layout.tsx  # Auth guard (client-side), sidebar, header
  app/(dashboard)/admin/      # Admin screens
  app/(dashboard)/lider/      # IT Leader screens
  app/(dashboard)/tecnico/    # Technician screens
  app/(dashboard)/usuario/    # End user screens
  app/(dashboard)/inventario/ # Inventory manager screens
  app/(dashboard)/cuentadante/# Asset holder screens
  components/layout/          # AppSidebar (role-aware nav), Header, Breadcrumbs
  components/tickets/         # TicketForm, TicketTable, TicketDetail, TicketTimeline
  components/assets/          # AssetForm, AssetTable, AssetDetail, AssetLifecycle
  components/dashboard/       # KpiCards, PriorityDonut, TicketsChart, SlaAlerts
  components/ui/              # shadcn/ui library
  hooks/                      # use-auth, use-tickets, use-assets, use-dashboard, use-mobile
  stores/                     # auth-store (persisted), ui-store
  types/                      # user, ticket, asset, maintenance, shift, api
  lib/api.ts                  # Axios instance with Bearer token interceptor
  lib/constants.ts            # Status/priority configs with colors, CAMPUSES list
```

**Auth guard**: Client-side only in `(dashboard)/layout.tsx` — checks Zustand `isAuthenticated` after hydration. No Next.js `middleware.ts` exists.

**API client** (`src/lib/api.ts`): Axios reads token from `localStorage['auth-storage']` (Zustand persist). 401 response interceptor clears storage and redirects to `/login`.

**Role routing**: `getRoleRoute()` in auth-store maps role slug to route prefix. Sidebar navigation defined per role in `app-sidebar.tsx` via `navByRole` record.

### Multitenancy (not yet active)

- Strategy: separate PostgreSQL database per tenant (prefix `tenant_`)
- Identification: domain-based (`InitializeTenancyByDomain`)
- Central domains: `localhost`, `127.0.0.1`
- `TenancyServiceProvider` auto-creates/migrates DB on `TenantCreated`
- `EnsureTenantAccess` middleware exists but is not applied to any route group
- All current API routes operate in central context

### CORS & Sanctum Config

- `config/cors.php`: allows `localhost:3000`, `supports_credentials: true`, paths `['api/*', 'sanctum/csrf-cookie']`
- `config/sanctum.php`: stateful domains include `localhost:3000`, token expiration `null`

## Conventions

### Backend (Laravel/PHP)
- Class/method/variable names: **English**
- Comments: Spanish where needed for business logic
- Enums: PHP 8.1 backed string enums with `label()` method in `app/Enums/`
- Asset codes auto-generated as `UTS-{CAT}-{XXXX}` in AssetController
- Filters use `ilike` (PostgreSQL) — test suite uses SQLite which doesn't support `ilike`
- JSONB columns: `Asset.specs`

### Frontend (Next.js/TypeScript)
- UI labels and text: **Spanish** (end-user facing)
- Components: PascalCase, files kebab-case
- Hooks pattern: TanStack Query wrapping Axios calls
- Types in `src/types/`, one file per domain entity
- Stores in `src/stores/`, Zustand with `persist` middleware for auth

## Color Palette (UTS Institutional)

- Green: `#1B5E20` (dark), `#4CAF50` (medium), `#C8E6C9` (light)
- Accent: `#F9A825`, `#CDDC39`
- Background: `#FAFAFA` (light), `#FFFFFF` (cards)
- Text: `#1A1A1A` (primary), `#6B7280` (secondary)
- States: Red `#D32F2F`, Orange `#F57C00`, Yellow `#FBC02D`, Green `#388E3C`
- Sidebar: gradient `#1B3A1B` to `#2E5A2E`

## Campuses

Bucaramanga (Principal), Piedecuesta, Barrancabermeja, Yopal, Velez, Charala

## Known Gaps

- Services (`SlaService`, `TicketAssignmentService`, `ReportService`) exist but are not called from controllers
- No Form Request validation classes — validation is inline
- No tests written yet (empty `tests/Unit/` and `tests/Feature/`)
- DashboardController returns global counts with no role/campus scoping
- No Next.js middleware for server-side route protection
- `spatie/laravel-activitylog` imported in User model but trait not applied
- Root layout metadata still says "Create Next App"

## Reference Docs

- `SYSTEM.md` — Full system documentation: roles, screens, API endpoints, DB schema, QA flows
- `frontend/AGENTS.md` — Next.js 16 breaking changes warning (auto-generated by `next dev`)
