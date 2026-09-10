export default function AdminLogsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Logs de Auditoría</h1>
      <p className="text-gray-500 mb-6">Registro detallado de todas las acciones críticas del sistema</p>
      <div className="bg-white rounded-xl border p-6">
        <div className="text-center py-12 text-gray-400">Tabla de logs con filtros por usuario, acción y fecha</div>
      </div>
    </div>
  );
}
