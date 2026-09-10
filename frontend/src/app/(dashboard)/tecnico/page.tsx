export default function TecnicoDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mi Panel</h1>
      <p className="text-gray-500 mb-6">Técnico de Soporte</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Abiertos', value: '12' },
          { label: 'En Progreso', value: '08' },
          { label: 'Pendientes', value: '04' },
          { label: 'Cerrados Hoy', value: '23' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Mis Tickets</h2>
        <div className="text-center py-12 text-gray-400">Tabla de tickets asignados</div>
      </div>
    </div>
  );
}
