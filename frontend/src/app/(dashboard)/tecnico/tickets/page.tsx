export default function TecnicoTicketsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mis Tickets</h1>
      <p className="text-gray-500 mb-6">Tickets asignados a tu cuenta</p>
      <div className="bg-white rounded-xl border p-6">
        <div className="flex gap-3 mb-4">
          {['Todos', 'Abiertos', 'En Progreso', 'Pendientes', 'Cerrados'].map((f) => (
            <button key={f} className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50">{f}</button>
          ))}
        </div>
        <div className="text-center py-12 text-gray-400">Tabla de tickets con indicador SLA</div>
      </div>
    </div>
  );
}
