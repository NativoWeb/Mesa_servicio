export default function MiTurnoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mi Turno</h1>
      <p className="text-gray-500 mb-6">Consulta tu horario semanal asignado y gestiona tu tiempo de servicio</p>
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-green-700 font-medium uppercase">Turno Activo Ahora</p>
            <p className="text-gray-900 font-medium">Hoy, Lunes · 8:00 AM – 5:00 PM</p>
            <p className="text-gray-500 text-sm">Sede principal · Bucaramanga</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Tiempo restante</p>
            <p className="text-2xl font-bold">3h 20min</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Calendario Semanal</h2>
        <div className="text-center py-12 text-gray-400">Calendario de turnos semanal</div>
      </div>
    </div>
  );
}
