export default function AdminSlaPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Configuración de Tiempos SLA</h1>
      <p className="text-gray-500 mb-6">Define los tiempos de respuesta y resolución por prioridad</p>
      <div className="bg-white rounded-xl border p-6">
        <div className="text-center py-12 text-gray-400">Tabla editable de configuración SLA</div>
      </div>
    </div>
  );
}
