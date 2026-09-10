export default function AdminReportesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Reportes y Métricas</h1>
      <p className="text-gray-500 mb-6">Genera y descarga informes de la Mesa de Servicio e Inventario TI</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { id: 'REP-01', title: 'Tickets por Técnico' },
          { id: 'REP-02', title: 'Activos por Sede' },
          { id: 'REP-03', title: 'Cumplimiento SLA' },
          { id: 'REP-04', title: 'Mantenimientos' },
        ].map((r) => (
          <div key={r.id} className="bg-white rounded-xl border p-6">
            <p className="text-xs text-gray-500">{r.id}</p>
            <h3 className="font-semibold mt-1">{r.title}</h3>
            <button className="mt-3 text-sm text-green-700 font-medium">Generar reporte →</button>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Reportes Programados</h2>
        <div className="text-center py-8 text-gray-400">Tabla de reportes automáticos programados</div>
      </div>
    </div>
  );
}
