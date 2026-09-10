'use client';

const ROLES = [
  {
    slug: 'admin',
    name: 'Administrador del Sistema',
    description: 'Acceso total al sistema, configuracion de parametros, gestion de usuarios y roles.',
    permissions: ['Dashboard global', 'Gestion de usuarios', 'Configuracion SLA', 'SMTP/SMS', 'Backup', 'Logs de auditoria', 'Todos los modulos'],
    color: 'bg-red-100 text-red-700',
  },
  {
    slug: 'it_leader',
    name: 'Lider TIC',
    description: 'Dashboard global, reasignacion y escalamiento de tickets, reportes y mensajeria masiva.',
    permissions: ['Dashboard global', 'Reasignar tickets', 'Escalar tickets', 'Reportes', 'Mensajeria masiva', 'Ver todos los tickets'],
    color: 'bg-blue-100 text-blue-700',
  },
  {
    slug: 'technician',
    name: 'Tecnico de Soporte',
    description: 'Gestion de tickets asignados, equipos vinculados y consulta de turnos.',
    permissions: ['Tickets asignados', 'Actualizar estado', 'Equipos vinculados', 'Consultar turnos', 'Agregar comentarios'],
    color: 'bg-green-100 text-green-700',
  },
  {
    slug: 'inventory_manager',
    name: 'Gestor de Inventario',
    description: 'CRUD completo de activos, registro de mantenimientos y gestion de cuentadantes.',
    permissions: ['CRUD activos', 'Registrar mantenimientos', 'Asignar cuentadantes', 'Hoja de vida equipos', 'Reportes de inventario'],
    color: 'bg-purple-100 text-purple-700',
  },
  {
    slug: 'end_user',
    name: 'Usuario Final',
    description: 'Crear y consultar tickets propios, recibir notificaciones de estado.',
    permissions: ['Crear tickets', 'Ver tickets propios', 'Agregar comentarios', 'Notificaciones'],
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    slug: 'asset_holder',
    name: 'Cuentadante',
    description: 'Consultar equipos bajo su custodia, hoja de vida y alertas de mantenimiento.',
    permissions: ['Ver equipos a cargo', 'Hoja de vida', 'Alertas de mantenimiento', 'Historial de activos'],
    color: 'bg-orange-100 text-orange-700',
  },
];

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuracion de Roles y Permisos</h1>
        <p className="text-gray-500 text-sm mb-6">Matriz de permisos RBAC del sistema. Los roles son definidos por el sistema y no son editables.</p>
      </div>

      <div className="grid gap-4">
        {ROLES.map((role) => (
          <div key={role.slug} className="bg-white rounded-xl border p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.color}`}>
                    {role.slug}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((perm) => (
                <span
                  key={perm}
                  className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-medium"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
