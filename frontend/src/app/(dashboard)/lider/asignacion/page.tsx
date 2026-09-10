export default function AsignacionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Asignación de tickets y turnos</h1>
      <p className="text-gray-500 mb-6">Asigna tickets a técnicos disponibles</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Tickets pendientes de asignación</h2>
          <div className="text-center py-12 text-gray-400">Lista de tickets sin asignar</div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Técnicos disponibles</h2>
          <div className="text-center py-12 text-gray-400">Cards de técnicos con carga</div>
        </div>
      </div>
    </div>
  );
}
