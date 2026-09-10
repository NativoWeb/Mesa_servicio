export default function AdminConfigPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
      <p className="text-gray-500 mb-6">Notificaciones, SMTP, SMS, Backup y Restauración</p>
      <div className="space-y-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Notificaciones del Sistema</h2>
          <div className="text-center py-8 text-gray-400">Configuración de plantillas y canales</div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Backup y Restauración</h2>
          <div className="text-center py-8 text-gray-400">Historial de backups y acciones</div>
        </div>
      </div>
    </div>
  );
}
