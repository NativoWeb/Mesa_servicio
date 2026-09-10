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
  'Bucaramanga (Principal)',
  'Piedecuesta',
  'Barrancabermeja',
  'Yopal',
  'Velez',
  'Charala',
] as const;
