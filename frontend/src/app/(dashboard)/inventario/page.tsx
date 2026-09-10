export default function InventarioDashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario de Activos TI</h1>
          <p className="text-gray-500">Gestión del parque tecnológico institucional</p>
        </div>
        <button className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Registrar nuevo equipo</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Activos', value: '1,248' },
          { label: 'Operativos', value: '1,150' },
          { label: 'Averiados', value: '42' },
          { label: 'Mantenimiento', value: '56' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-6">
        <div className="text-center py-12 text-gray-400">Tabla de inventario con filtros y acciones masivas</div>
      </div>
    </div>
  );
}
