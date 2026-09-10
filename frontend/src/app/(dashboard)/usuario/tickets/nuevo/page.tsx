export default function NuevoTicketPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Nueva Solicitud de Soporte</h1>
      <p className="text-gray-500 mb-6">Completa la información detallada para que nuestro equipo pueda resolver tu incidencia.</p>
      <div className="bg-white rounded-xl border p-6 space-y-6">
        <div>
          <h2 className="font-semibold mb-3">1. Clasificación de la Solicitud</h2>
          <div className="flex gap-3">
            {['Incidente', 'Solicitud', 'Requerimiento'].map((t) => (
              <button key={t} className="flex-1 px-4 py-3 border rounded-lg text-sm hover:bg-gray-50 text-center">{t}</button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-3">2. Detalle del Problema</h2>
          <div className="space-y-3">
            <input className="w-full px-4 py-2 border rounded-lg" placeholder="Asunto" />
            <textarea className="w-full px-4 py-2 border rounded-lg h-24" placeholder="Descripción detallada..." />
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-3">3. Ubicación Física</h2>
          <div className="grid grid-cols-2 gap-3">
            <input className="px-4 py-2 border rounded-lg" placeholder="Sede" />
            <input className="px-4 py-2 border rounded-lg" placeholder="Ubicación específica" />
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-3">4. Adjuntos y Evidencia</h2>
          <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-400">
            Arrastra archivos aquí o haz clic
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
          <button className="bg-green-800 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium">Enviar solicitud →</button>
        </div>
      </div>
    </div>
  );
}
