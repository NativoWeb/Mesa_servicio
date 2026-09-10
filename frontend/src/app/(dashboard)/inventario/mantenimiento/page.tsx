export default function MantenimientosPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mantenimientos</h1>
          <p className="text-gray-500">Historial y registro de mantenimientos</p>
        </div>
        <button className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Registrar mantenimiento</button>
      </div>
      <div className="bg-white rounded-xl border p-6">
        <div className="text-center py-12 text-gray-400">Calendario y tabla de mantenimientos</div>
      </div>
    </div>
  );
}
