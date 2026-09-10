export default function MensajeriaPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mensajería Masiva</h1>
      <p className="text-gray-500 mb-6">Envía comunicaciones a usuarios de la plataforma</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Configuración del Mensaje</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Canal de envío</label>
              <div className="flex gap-3">
                {['Correo Electrónico', 'SMS Celular', 'Ambos canales'].map((c) => (
                  <button key={c} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asunto del mensaje</label>
              <input className="w-full px-4 py-2 border rounded-lg" placeholder="Ej: Actualización obligatoria de plataforma" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuerpo del mensaje</label>
              <textarea className="w-full px-4 py-2 border rounded-lg h-32" placeholder="Escribe el contenido institucional aquí..." />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Segmentación de Audiencia</h2>
          <div className="text-center py-12 text-gray-400">Filtros de destinatarios</div>
        </div>
      </div>
    </div>
  );
}
