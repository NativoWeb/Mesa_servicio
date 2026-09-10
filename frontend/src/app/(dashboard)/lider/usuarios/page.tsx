export default function UsuariosRolesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios y Roles</h1>
          <p className="text-gray-500">Gestiona los usuarios de la Mesa de Servicio</p>
        </div>
        <button className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Crear usuario</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Usuarios', value: '1,248' },
          { label: 'Técnicos Activos', value: '32' },
          { label: 'En Turno Ahora', value: '14' },
          { label: 'Usuarios Inactivos', value: '87' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-6">
        <div className="text-center py-12 text-gray-400">Tabla de usuarios se implementará aquí</div>
      </div>
    </div>
  );
}
