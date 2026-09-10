export default function UsuarioDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Buenos días, Usuario</h1>
      <p className="text-gray-500 mb-6">Aquí puedes crear y hacer seguimiento a tus solicitudes de soporte técnico institucional.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Tickets Abiertos', value: '12', color: 'text-blue-600' },
          { label: 'En Progreso', value: '04', color: 'text-yellow-600' },
          { label: 'Cerrados este Mes', value: '28', color: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-6">
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Mis Tickets Recientes</h2>
          <a href="#" className="text-sm text-green-700 hover:underline">Ver todos mis tickets →</a>
        </div>
        <div className="text-center py-12 text-gray-400">Lista de tickets recientes</div>
      </div>
    </div>
  );
}
