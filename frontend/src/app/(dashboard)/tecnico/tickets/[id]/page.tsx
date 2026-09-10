export default function TecnicoTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Detalle del Ticket</h1>
      <p className="text-gray-500 mb-6">Gestiona y actualiza el estado del ticket</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Información del Ticket</h2>
            <div className="text-center py-8 text-gray-400">Detalles y acciones del ticket</div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Seguimiento</h2>
            <div className="text-center py-8 text-gray-400">Conversación y timeline</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Activo Relacionado</h2>
          <div className="text-center py-8 text-gray-400">Info del equipo vinculado</div>
        </div>
      </div>
    </div>
  );
}
