export default function LiderInventarioPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario de Activos TI</h1>
          <p className="text-gray-500">Consulta y gestiona los activos tecnológicos de todas las sedes</p>
        </div>
        <div className="flex gap-2">
          <button className="border px-4 py-2 rounded-lg text-sm">Exportar CSV</button>
          <button className="border px-4 py-2 rounded-lg text-sm">Exportar PDF</button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total', value: '1,248' },
          { label: 'Operativos', value: '1,180' },
          { label: 'Averiados', value: '14' },
          { label: 'Mantenimiento', value: '54' },
          { label: 'Próximos', value: '12' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-6">
        <div className="text-center py-12 text-gray-400">Tabla de activos se implementará aquí</div>
      </div>
    </div>
  );
}
