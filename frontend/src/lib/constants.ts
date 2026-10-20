export const STATUS_CONFIG = {
  open: { label: 'Abierto', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  in_progress: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
  pending: { label: 'Pendiente', color: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
  escalated: { label: 'Escalado', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  closed: { label: 'Cerrado', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
} as const;

export const PRIORITY_CONFIG = {
  low: { label: 'Baja', color: 'bg-slate-100 text-slate-800' },
  medium: { label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  high: { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  critical: { label: 'Critica', color: 'bg-red-100 text-red-800' },
} as const;

export const ASSET_STATUS_CONFIG = {
  new: { label: 'Nuevo', color: 'bg-blue-100 text-blue-800' },
  operational: { label: 'Operativo', color: 'bg-green-100 text-green-800' },
  damaged: { label: 'Averiado', color: 'bg-red-100 text-red-800' },
  decommissioned: { label: 'Dado de Baja', color: 'bg-gray-100 text-gray-800' },
  retired: { label: 'Retirado', color: 'bg-gray-100 text-gray-500' },
} as const;

export const CAMPUSES = [
  'Sede Central',
  'Sede Norte',
  'Sede Sur',
  'Sede Este',
  'Sede Oeste',
  'Sede Regional',
] as const;

export const PERMISSION_LABELS: Record<string, string> = {
  'tickets.view_all': 'Ver todos los tickets',
  'tickets.view_own': 'Ver tickets propios',
  'tickets.create': 'Crear tickets',
  'tickets.update': 'Actualizar tickets',
  'tickets.delete': 'Eliminar tickets',
  'tickets.assign': 'Asignar tickets',
  'tickets.escalate': 'Escalar tickets',
  'assets.view_all': 'Ver todos los activos',
  'assets.view_own': 'Ver activos propios',
  'assets.create': 'Crear activos',
  'assets.update': 'Editar activos',
  'assets.delete': 'Eliminar activos',
  'maintenances.view_all': 'Ver todos los mantenimientos',
  'maintenances.view_own': 'Ver mantenimientos propios',
  'maintenances.create': 'Crear mantenimientos',
  'maintenances.update': 'Editar mantenimientos',
  'maintenances.delete': 'Eliminar mantenimientos',
  'users.view': 'Ver usuarios',
  'users.create': 'Crear usuarios',
  'users.update': 'Editar usuarios',
  'users.delete': 'Eliminar usuarios',
  'reports.view': 'Ver reportes',
  'reports.export': 'Exportar reportes',
  'roles.manage': 'Gestionar roles',
  'config.manage': 'Configuracion del sistema',
  'audit.view': 'Ver auditoria',
  'sla.manage': 'Configurar SLA',
  'messages.send': 'Mensajeria masiva',
  'shifts.view': 'Ver turnos',
  'shifts.manage': 'Gestionar turnos',
  'comments.internal': 'Comentarios internos',
};

export const PERMISSION_GROUP_LABELS: Record<string, string> = {
  tickets: 'Tickets',
  assets: 'Activos',
  maintenances: 'Mantenimientos',
  users: 'Usuarios',
  reports: 'Reportes',
  roles: 'Roles',
  config: 'Configuracion',
  audit: 'Auditoria',
  sla: 'SLA',
  messages: 'Mensajeria',
  shifts: 'Turnos',
  comments: 'Comentarios',
};
