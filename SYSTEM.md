# Mesa de Servicio TI - Documentacion del Sistema

## Descripcion General

Sistema SaaS de Mesa de Servicio (Service Desk) para la gestion de soporte tecnico e inventario de activos tecnologicos institucionales. Arquitectura multitenant con separacion por schema en PostgreSQL.

---

## Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| Backend | Laravel 11 + PHP 8.2 |
| Frontend | Next.js 15 + React 19 + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Base de datos | PostgreSQL 18 |
| Auth | Laravel Sanctum (Token Bearer) |
| RBAC | spatie/laravel-permission |
| Graficas | Recharts |
| State | Zustand (persistido en localStorage) |

---

## Como Levantar el Proyecto

### Requisitos

- PHP 8.2+
- Composer 2.x
- Node.js 18+
- PostgreSQL 16+

### Backend

```bash
cd backend
cp .env.example .env
# Editar .env con credenciales de PostgreSQL:
# DB_CONNECTION=pgsql
# DB_DATABASE=mesa_ayuda
# DB_USERNAME=postgres
# DB_PASSWORD=tu_password

php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve --port=8000
```

### Frontend

```bash
cd frontend
npm install
# Crear .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

npm run dev
```

### URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Login: http://localhost:3000/login

---

## Usuarios de Prueba

Todos los usuarios tienen password: `password`

| Rol | Email | Nombre | Sede | Redirige a |
|-----|-------|--------|------|-----------|
| Administrador | admin@demo.servicedesk.com | Admin Sistema | Global | /admin |
| Lider TIC | lider@demo.servicedesk.com | Carlos Mejia | Sede Central | /lider |
| Tecnico | tecnico@demo.servicedesk.com | Andres Gomez | Sede Central | /tecnico |
| Gestor Inventario | inventario@demo.servicedesk.com | Martha Rueda | Sede Central | /inventario |
| Usuario Final | usuario@demo.servicedesk.com | Juan Perez | Sede Central | /usuario |
| Cuentadante | cuentadante@demo.servicedesk.com | Laura Pineda | Sede Norte | /cuentadante |

---

## Roles y Permisos

### 1. Administrador del Sistema (`admin`) -> /admin

**Acceso total al sistema.**

Pantallas:
- **Dashboard Global**: Estado del servidor, uptime, usuarios activos, sinc. LDAP, ultimo backup. Graficas de tickets creados vs resueltos y tendencia de usuarios activos. Alertas criticas del sistema.
- **Usuarios**: Gestion CRUD de usuarios del sistema.
- **Roles**: Configuracion de la matriz de permisos RBAC.
- **Config SLA**: Tabla editable de tiempos de respuesta/resolucion por prioridad (Critica, Alta, Media, Baja) con % de cumplimiento.
- **Configuracion**: LDAP, SMTP, plantillas de notificacion, backup y restauracion.
- **Logs de Auditoria**: Registro con timestamp, usuario, accion, detalle, IP y estado (exito/bloqueado). Filtros por usuario, accion y fecha. Export CSV/PDF.
- **Reportes**: 5 tipos de reportes (Tickets por Tecnico, Activos por Sede, Cumplimiento SLA, Mantenimientos, Actividad Usuarios). Vista previa, filtros, descarga PDF/CSV/Excel. Reportes programados con frecuencia y destinatarios.

### 2. Lider TIC (`it_leader`) -> /lider

**Supervisa toda la operacion de la mesa de servicio.**

Pantallas:
- **Dashboard Principal**: 5 KPIs (Abiertos, En Progreso, Resueltos, Tasa SLA, Criticos sin resolver). Grafica donut de tickets por prioridad. Grafica de barras de tickets resueltos ultimos 7 dias. Carga operativa por tecnico con barras de porcentaje. Alertas de SLA y proximos eventos. Cola de tickets sin asignar con boton "Asignar ahora".
- **Todos los Tickets**: Lista completa con filtros por estado, busqueda, opciones de reasignacion.
- **Asignacion**: Tickets pendientes de asignacion + panel de tecnicos disponibles con carga.
- **Inventario**: Vista de activos con exportacion CSV/PDF.
- **Mensajeria Masiva**: Envio de comunicaciones por correo/SMS con segmentacion por rol y sede.
- **Reportes**: Generacion de informes con filtros.
- **Usuarios y Roles**: Gestion de usuarios con KPIs (total, tecnicos activos, en turno, inactivos).

### 3. Tecnico de Soporte (`technician`) -> /tecnico

**Atiende los tickets asignados.**

Pantallas:
- **Mi Panel**: Alerta de tickets con SLA en riesgo. 4 KPIs (Abiertos, En Progreso, Pendientes, Cerrados Hoy). Tabla de tickets con barra de SLA (verde < 40%, amarillo 40-70%, rojo > 70%). Filtros por estado, prioridad y categoria.
- **Detalle de Ticket**: Cambiar estado (select + boton Actualizar). Registrar tiempo invertido. 4 acciones: Agregar diagnostico, Escalar ticket, Ver historial, Cerrar ticket. Info del activo vinculado. Seguimiento/conversacion. Modal de cierre con textarea y checkbox de confirmacion.
- **Equipos Relacionados**: Activos vinculados a tickets activos (solo lectura).
- **Mi Turno**: Turno activo con tiempo restante. Calendario semanal con horarios y sedes. Proximas semanas.

### 4. Gestor de Inventario (`inventory_manager`) -> /inventario

**Administra el parque tecnologico.**

Pantallas:
- **Inventario de Activos**: 4 KPIs (Total, Operativos, Averiados, Mantenimiento). Tabla con filtros por categoria, sede, estado. Busqueda por serial/nombre. Seleccion multiple con acciones masivas (cambiar estado, cambiar sede, exportar). Vista grid/lista.
- **Registrar Nuevo Equipo**: Formulario de 5 secciones colapsables (Identificacion, Adquisicion, Ubicacion, Responsabilidad, Info adicional). Verificacion de serial disponible en tiempo real.
- **Detalle de Activo**: Hoja de vida completa del equipo.
- **Registrar Mantenimiento**: Formulario con tipo (Preventivo/Correctivo/Actualizacion/Limpieza), ejecucion y responsable, resultado final, documentacion adjunta.
- **Calendario de Mantenimientos**: Vista de mantenimientos programados.

### 5. Usuario Final (`end_user`) -> /usuario

**Crea y da seguimiento a sus tickets.**

Pantallas:
- **Dashboard**: Saludo personalizado. 3 KPIs (Abiertos, En Progreso, Cerrados). Tabla de tickets recientes con estado y fecha. **Datos reales del API.**
- **Crear Ticket**: Formulario de 4 secciones (Clasificacion: incidente/solicitud/requerimiento, Detalle del problema, Ubicacion fisica, Adjuntos). Validacion en tiempo real. **Conectado al API real — crea tickets en la BD.**
- **Mis Tickets**: Vista de cards con filtros por estado, busqueda, paginacion. **Datos reales del API.**
- **Detalle del Ticket**: Descripcion, timeline de eventos, conversacion con el tecnico, ubicacion, adjuntos. **Datos reales del API.**
- **Notificaciones**: Lista de notificaciones con indicadores de no leido.

### 6. Cuentadante (`asset_holder`) -> /cuentadante

**Ve los equipos bajo su responsabilidad.**

Pantallas:
- **Dashboard**: 3 KPIs (Equipos a cargo, Alertas activas, Mantenimientos este mes). Banner de alerta de mantenimiento proximo. Tabla de inventario de equipos con estado y link a hoja de vida.
- **Hoja de Vida del Equipo**: Banner de mantenimiento pendiente. Info tecnica (categoria, modelo, serial, fecha compra, ubicacion). Specs del sistema (procesador, RAM, SSD, SO). Estado y responsabilidad. Garantia. Documentos adjuntos. Timeline de vida util (cambios de cuentadante, mantenimientos, cambios de ubicacion, ingreso).
- **Notificaciones**: Alertas de mantenimiento, cambios de responsable, mantenimientos completados, garantia por vencer.

---

## Endpoints API

### Auth
| Metodo | Ruta | Descripcion |
|--------|------|------------|
| POST | /api/auth/login | Login (email + password) -> token |
| POST | /api/auth/logout | Logout (revoca token) |
| GET | /api/auth/me | Perfil del usuario autenticado |

### Tickets (CRUD completo - conectado al frontend)
| Metodo | Ruta | Descripcion |
|--------|------|------------|
| GET | /api/tickets | Listar tickets (paginado, filtros: status, priority, search) |
| POST | /api/tickets | Crear ticket |
| GET | /api/tickets/{id} | Ver detalle con relaciones |
| PUT | /api/tickets/{id} | Actualizar ticket |
| DELETE | /api/tickets/{id} | Eliminar ticket |

### Activos
| Metodo | Ruta | Descripcion |
|--------|------|------------|
| GET | /api/assets | Listar activos |
| POST | /api/assets | Crear activo |
| GET | /api/assets/{id} | Ver detalle |
| PUT | /api/assets/{id} | Actualizar activo |
| DELETE | /api/assets/{id} | Eliminar activo |

### Mantenimientos
| Metodo | Ruta | Descripcion |
|--------|------|------------|
| GET | /api/maintenances | Listar mantenimientos |
| POST | /api/maintenances | Registrar mantenimiento |
| GET | /api/maintenances/{id} | Ver detalle |
| PUT | /api/maintenances/{id} | Actualizar |
| DELETE | /api/maintenances/{id} | Eliminar |

### Otros
| Metodo | Ruta | Descripcion |
|--------|------|------------|
| GET | /api/dashboard | KPIs del dashboard |
| GET/POST | /api/users | CRUD usuarios |
| GET/POST | /api/shifts | CRUD turnos |
| GET/POST | /api/messages | Mensajeria masiva |
| GET | /api/reports/* | Reportes (tickets, assets, maintenances, export) |

---

## Sedes Configuradas

| ID | Nombre |
|----|--------|
| 1 | Sede Central |
| 2 | Sede Norte |
| 3 | Sede Sur |
| 4 | Sede Este |
| 5 | Sede Oeste |
| 6 | Sede Regional |

---

## Flujos Principales para QA

### Flujo 1: Login y redireccion por rol
1. Ir a /login
2. Ingresar credenciales de cualquier rol
3. Verificar que redirige al dashboard correcto
4. Verificar que el sidebar muestra la navegacion del rol
5. Verificar que el header muestra nombre, rol y sede
6. Hacer logout desde el dropdown del header
7. Verificar que redirige a /login

### Flujo 2: Crear ticket (Usuario)
1. Login como usuario@demo.servicedesk.com
2. Clic en "Crear ticket" o FAB (+)
3. Seleccionar tipo (Incidente/Solicitud/Requerimiento)
4. Seleccionar categoria y prioridad
5. Escribir asunto (min 6 caracteres) y descripcion
6. Seleccionar sede y ubicacion
7. Opcionalmente adjuntar archivos
8. Clic "Enviar solicitud"
9. Verificar pantalla de exito
10. Ir a "Mis Tickets" y ver el ticket creado

### Flujo 3: Gestionar ticket (Tecnico)
1. Login como tecnico@demo.servicedesk.com
2. Ver tabla de tickets con indicadores SLA
3. Clic en un ticket para ver detalle
4. Cambiar estado a "En Progreso"
5. Registrar tiempo invertido
6. Agregar diagnostico
7. Cerrar ticket con confirmacion

### Flujo 4: Ver equipos (Cuentadante)
1. Login como cuentadante@demo.servicedesk.com
2. Ver tabla de equipos a cargo
3. Clic "Ver hoja de vida" en un equipo
4. Verificar info tecnica, specs, historial, documentos

### Flujo 5: Panel admin
1. Login como admin@demo.servicedesk.com
2. Verificar dashboard con KPIs del sistema
3. Ir a Config SLA y editar tiempos
4. Ir a Logs de Auditoria y filtrar
5. Ir a Reportes y generar uno

---

## Estructura de la Base de Datos

### Tablas principales
- `users` - Usuarios del sistema con roles
- `tickets` - Tickets de soporte (incidentes, solicitudes)
- `assets` - Activos tecnologicos (equipos, servidores, etc.)
- `maintenances` - Registro de mantenimientos por activo
- `comments` - Comentarios polimorfico (tickets, activos)
- `attachments` - Archivos adjuntos polimorficos
- `shifts` - Turnos de tecnicos
- `mass_messages` - Mensajes masivos (email/SMS)
- `ticket_events` - Timeline de eventos por ticket
- `sla_configs` - Configuracion de tiempos SLA por prioridad
- `roles` / `permissions` - RBAC (spatie/permission)
- `personal_access_tokens` - Tokens Sanctum

---

## Estado del Desarrollo

### Funcional (conectado al API)
- Login/Logout con Sanctum tokens
- Redireccion por rol
- Proteccion de rutas (redirige a /login si no autenticado)
- CRUD de tickets (crear, listar, ver detalle)
- Persistencia de sesion (sobrevive page refresh)

### UI completa (datos mock)
- Dashboard Lider TIC (KPIs, graficas Recharts, workload, SLA alerts)
- Dashboard Tecnico (tabla con SLA bars, detalle con acciones, turnos)
- Dashboard Cuentadante (equipos, hoja de vida, notificaciones)
- Inventario (tabla con filtros, formulario 5 secciones, mantenimientos)
- Panel Admin (KPIs sistema, charts, config SLA, logs, reportes)

### Pendiente
- Conectar inventario y activos al API real
- Conectar dashboard del Lider TIC al API real
- Endpoint de comentarios para conversacion en tickets
- Notificaciones en tiempo real (Broadcasting)
- Multitenancy funcional (stancl/tenancy ya instalado)
- Upload de archivos adjuntos
- Export PDF/Excel real
- Integracion LDAP/SSO
