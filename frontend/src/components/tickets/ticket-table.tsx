export function TicketTable() {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="text-left p-3 font-medium text-gray-500">ID</th>
            <th className="text-left p-3 font-medium text-gray-500">Asunto</th>
            <th className="text-left p-3 font-medium text-gray-500">Categoría</th>
            <th className="text-left p-3 font-medium text-gray-500">Prioridad</th>
            <th className="text-left p-3 font-medium text-gray-500">Estado</th>
            <th className="text-left p-3 font-medium text-gray-500">Sede</th>
            <th className="text-left p-3 font-medium text-gray-500">Creado</th>
            <th className="text-left p-3 font-medium text-gray-500">SLA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={8} className="p-12 text-center text-gray-400">
              Los datos de tickets se cargarán desde la API
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
