export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Panel de Administración del Sistema</h1>
      <p className="text-gray-500 mb-6">Gestión centralizada de infraestructura, usuarios y parámetros críticos</p>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Estado Servidor', value: 'Operativo', color: 'text-green-600' },
          { label: 'Usuarios Activos', value: '1,248', color: '' },
          { label: 'Uptime', value: '99.8%', color: '' },
          { label: 'Sinc. LDAP', value: 'hace 5 min', color: '' },
          { label: 'Último Backup', value: 'hoy 2:00 AM', color: '' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className={`text-lg font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Tickets: Creados vs. Resueltos</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">[Gráfica de barras]</div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Usuarios Activos</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">[Gráfica de línea]</div>
        </div>
      </div>
      <div className="bg-white rounded-xl border p-6 mb-8">
        <h2 className="font-semibold mb-4">Alertas Críticas del Sistema</h2>
        <div className="text-center py-8 text-gray-400">Alertas de LDAP, backup, SLA</div>
      </div>
      <div>
        <h2 className="font-semibold mb-4">Acciones de Configuración Rápida</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['Usuarios y Roles', 'Config LDAP', 'Parámetros SLA', 'Logs de Auditoría', 'Backup', 'Plantillas Notif.'].map((a) => (
            <button key={a} className="bg-white rounded-xl border p-4 text-center hover:bg-gray-50 text-sm font-medium">{a}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
