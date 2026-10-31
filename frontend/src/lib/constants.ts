export const STATUS_CONFIG = {
  open: { label: 'Abierto', color: 'bg-[#e6f0f8] text-[#2d76b0]', dot: 'bg-[#2d76b0]' },
  in_progress: { label: 'En Progreso', color: 'bg-[#fdf0e6] text-[#e2742a]', dot: 'bg-[#e2742a]' },
  pending: { label: 'Pendiente', color: 'bg-[#efecfa] text-[#6b55c4]', dot: 'bg-[#6b55c4]' },
  escalated: { label: 'Escalado', color: 'bg-[#fdeceb] text-[#cf3b35]', dot: 'bg-[#cf3b35]' },
  closed: { label: 'Cerrado', color: 'bg-[#eef2ec] text-[#66756c]', dot: 'bg-[#66756c]' },
} as const;

export const PRIORITY_CONFIG = {
  low: { label: 'Baja', color: 'bg-[#e5f4ea] text-[#2f8f57]', dot: 'bg-[#2f8f57]' },
  medium: { label: 'Media', color: 'bg-[#fbf5dc] text-[#c99a0e]', dot: 'bg-[#c99a0e]' },
  high: { label: 'Alta', color: 'bg-[#fdf0e6] text-[#e2742a]', dot: 'bg-[#e2742a]' },
  critical: { label: 'Critica', color: 'bg-[#fdeceb] text-[#cf3b35]', dot: 'bg-[#cf3b35]' },
} as const;

export const ASSET_STATUS_CONFIG = {
  new: { label: 'Nuevo', color: 'bg-[#e6f0f8] text-[#2d76b0]' },
  operational: { label: 'Operativo', color: 'bg-[#e5f4ea] text-[#2f8f57]' },
  damaged: { label: 'Averiado', color: 'bg-[#fdeceb] text-[#cf3b35]' },
  decommissioned: { label: 'Dado de Baja', color: 'bg-[#eef2ec] text-[#66756c]' },
  retired: { label: 'Retirado', color: 'bg-[#eef2ec] text-[#94a199]' },
} as const;

export const CAMPUSES = [
  'Bucaramanga',
  'Piedecuesta',
  'Barrancabermeja',
  'Yopal',
  'Velez',
  'Charala',
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
