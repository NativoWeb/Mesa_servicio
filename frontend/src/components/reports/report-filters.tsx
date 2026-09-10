export function ReportFilters() {
  return (
    <div className="bg-white rounded-xl border p-4 flex items-center gap-4 flex-wrap">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Rango de fechas</label>
        <input type="date" className="px-3 py-1.5 border rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Sede</label>
        <select className="px-3 py-1.5 border rounded-lg text-sm">
          <option>Todas</option>
          <option>Bucaramanga</option>
          <option>Piedecuesta</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Prioridad</label>
        <select className="px-3 py-1.5 border rounded-lg text-sm">
          <option>Todas</option>
          <option>Alta</option>
          <option>Media</option>
          <option>Baja</option>
        </select>
      </div>
      <button className="ml-auto bg-green-800 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
        Aplicar filtros
      </button>
    </div>
  );
}
