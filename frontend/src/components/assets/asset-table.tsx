export function AssetTable() {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="text-left p-3 font-medium text-gray-500">Equipo</th>
            <th className="text-left p-3 font-medium text-gray-500">Categoría</th>
            <th className="text-left p-3 font-medium text-gray-500">Marca/Modelo</th>
            <th className="text-left p-3 font-medium text-gray-500">Sede</th>
            <th className="text-left p-3 font-medium text-gray-500">Cuentadante</th>
            <th className="text-left p-3 font-medium text-gray-500">Estado</th>
            <th className="text-left p-3 font-medium text-gray-500">Próx. Mant.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7} className="p-12 text-center text-gray-400">
              Los datos de activos se cargarán desde la API
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
