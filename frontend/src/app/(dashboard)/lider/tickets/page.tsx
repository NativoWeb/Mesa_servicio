export default function LiderTicketsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Todos los Tickets</h1>
          <p className="text-gray-500">Gestión completa de tickets de soporte</p>
        </div>
        <button className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Crear ticket</button>
      </div>
      <div className="bg-white rounded-xl border p-6">
        <div className="flex gap-3 mb-4">
          {['Todos', 'Abiertos', 'En Progreso', 'Pendientes', 'Cerrados'].map((f) => (
            <button key={f} className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50">{f}</button>
          ))}
        </div>
        <div className="text-center py-12 text-gray-400">Tabla de tickets se implementará aquí</div>
      </div>
    </div>
  );
}
