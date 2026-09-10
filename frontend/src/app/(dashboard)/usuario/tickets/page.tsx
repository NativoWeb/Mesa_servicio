export default function MisTicketsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Tickets</h1>
        <button className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Crear nuevo ticket</button>
      </div>
      <div className="bg-white rounded-xl border p-6">
        <div className="flex gap-3 mb-4">
          {['Todos', 'Abiertos', 'En Progreso', 'Pendientes', 'Cerrados'].map((f) => (
            <button key={f} className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50">{f}</button>
          ))}
        </div>
        <div className="text-center py-12 text-gray-400">Vista de cards de tickets</div>
      </div>
    </div>
  );
}
