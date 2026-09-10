export default function LiderReportesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Reportes y Métricas</h1>
      <p className="text-gray-500 mb-6">Genera y descarga informes de la Mesa de Servicio e Inventario TI</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { id: 'REP-01', title: 'Tickets por Técnico', format: 'PDF / CSV' },
          { id: 'REP-02', title: 'Activos por Sede y Estado', format: 'Excel' },
          { id: 'REP-03', title: 'Cumplimiento de SLA', format: 'PDF' },
          { id: 'REP-04', title: 'Historial Mantenimientos', format: 'Excel / PDF' },
          { id: 'REP-05', title: 'Actividad Usuarios', format: 'PDF' },
        ].map((r) => (
          <div key={r.id} className="bg-white rounded-xl border p-6">
            <p className="text-xs text-gray-500 font-medium">{r.id}</p>
            <h3 className="font-semibold mt-1">{r.title}</h3>
            <p className="text-xs text-gray-400 mt-1">{r.format}</p>
            <button className="mt-3 text-sm text-green-700 font-medium hover:underline">Generar reporte →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
