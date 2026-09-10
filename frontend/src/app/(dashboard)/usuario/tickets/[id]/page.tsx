export default function UsuarioTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Detalle del Ticket</h1>
      <p className="text-gray-500 mb-6">Seguimiento de tu solicitud</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-2">Tu Descripción</h2>
            <div className="text-center py-8 text-gray-400">Descripción del ticket</div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Conversación</h2>
            <div className="text-center py-8 text-gray-400">Chat con el técnico</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-2">Detalles de Ubicación</h2>
            <div className="text-center py-4 text-gray-400">Info de ubicación</div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-2">Adjuntos</h2>
            <div className="text-center py-4 text-gray-400">Archivos adjuntos</div>
          </div>
        </div>
      </div>
    </div>
  );
}
