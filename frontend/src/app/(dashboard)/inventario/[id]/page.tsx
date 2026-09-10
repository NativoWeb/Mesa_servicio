export default function DetalleActivoPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Detalle del Activo</h1>
      <p className="text-gray-500 mb-6">Hoja de vida completa del equipo</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Información Técnica</h2>
            <div className="text-center py-8 text-gray-400">Datos del equipo</div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Historial de Vida Útil</h2>
            <div className="text-center py-8 text-gray-400">Timeline de mantenimientos y cambios</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-2">Estado y Garantía</h2>
            <div className="text-center py-4 text-gray-400">Estado actual</div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-2">Specs</h2>
            <div className="text-center py-4 text-gray-400">Especificaciones técnicas</div>
          </div>
        </div>
      </div>
    </div>
  );
}
