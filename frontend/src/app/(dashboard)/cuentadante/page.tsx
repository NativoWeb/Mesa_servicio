export default function CuentadanteDashboardPage() {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider">Dashboard Cuentadante</p>
      <h1 className="text-2xl font-bold text-gray-900">Hola, Cuentadante UTS.</h1>
      <p className="text-gray-500 mb-6">Estos son los equipos bajo tu responsabilidad.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Equipos a cargo', value: '15' },
          { label: 'Alertas activas', value: '2' },
          { label: 'Mantenimientos este mes', value: '3' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-6">
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className="text-3xl font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Inventario de Equipos</h2>
        <div className="text-center py-12 text-gray-400">Tabla de equipos a cargo</div>
      </div>
    </div>
  );
}
