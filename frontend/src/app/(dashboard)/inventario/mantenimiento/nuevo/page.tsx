export default function NuevoMantenimientoPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Registrar Mantenimiento</h1>
      <p className="text-gray-500 mb-6">Completa los detalles técnicos del servicio realizado al equipo</p>
      <div className="bg-white rounded-xl border p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold mb-3">1. Tipo de Mantenimiento</h2>
              <div className="flex gap-2">
                {['Preventivo', 'Correctivo', 'Actualización', 'Limpieza'].map((t) => (
                  <button key={t} className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50">{t}</button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-semibold mb-3">2. Ejecución y Responsable</h2>
              <div className="text-center py-4 text-gray-400 text-sm">Campos de técnico, fechas, duración</div>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold mb-3">3. Resultado Final</h2>
              <div className="text-center py-4 text-gray-400 text-sm">Estado final, próximo mantenimiento</div>
            </div>
            <div>
              <h2 className="font-semibold mb-3">4. Documentación</h2>
              <div className="text-center py-4 text-gray-400 text-sm">Informe técnico, fotos</div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
          <button className="bg-green-800 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium">Registrar mantenimiento</button>
        </div>
      </div>
    </div>
  );
}
