export default function HojaDeVidaEquipoPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Hoja de Vida del Equipo</h1>
      <p className="text-gray-500 mb-6">Información completa del activo</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Información Técnica</h2>
            <div className="text-center py-8 text-gray-400">Datos del equipo</div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Historial de Vida Útil</h2>
            <div className="text-center py-8 text-gray-400">Timeline de eventos del equipo</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-2">Estado y Responsabilidad</h2>
            <div className="text-center py-4 text-gray-400">Cuentadante y estado</div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-2">Documentos Adjuntos</h2>
            <div className="text-center py-4 text-gray-400">Actas, reportes</div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-2">Specs del Sistema</h2>
            <div className="text-center py-4 text-gray-400">Procesador, RAM, SSD, SO</div>
          </div>
        </div>
      </div>
    </div>
  );
}
