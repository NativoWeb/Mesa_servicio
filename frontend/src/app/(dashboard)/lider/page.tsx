export default function LiderDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Panel de Control — Mesa de Servicio TI</h1>
      <p className="text-gray-500 mb-6">Sede: Bucaramanga</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Tickets Abiertos', value: '128', color: 'text-blue-600' },
          { label: 'En Progreso', value: '42', color: 'text-yellow-600' },
          { label: 'Resueltos', value: '315', color: 'text-green-600' },
          { label: 'Tasa SLA', value: '94%', color: 'text-green-700' },
          { label: 'Críticos sin Resolver', value: '08', color: 'text-red-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Tickets por prioridad</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">[Gráfica de donut]</div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Tickets resueltos (Últimos 7 días)</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">[Gráfica de barras]</div>
        </div>
      </div>
    </div>
  );
}
