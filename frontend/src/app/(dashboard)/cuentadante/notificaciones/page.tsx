'use client';

const notificaciones = [
  { icon: '\uD83D\uDD27', title: 'Mantenimiento programado', desc: 'Tu equipo Laptop Dell Vostro requiere mantenimiento preventivo el 20/06/2025', time: 'Hace 2 horas', unread: true },
  { icon: '\uD83D\uDD04', title: 'Cambio de responsable aprobado', desc: 'Se aprobo el traslado del equipo PC HP al area de Contabilidad', time: 'Hace 1 dia', unread: true },
  { icon: '\u2705', title: 'Mantenimiento completado', desc: 'La impresora Kyocera fue revisada exitosamente por el tecnico Carlos Ruiz', time: 'Hace 3 dias', unread: false },
  { icon: '\u26A0\uFE0F', title: 'Garantia proxima a vencer', desc: 'La garantia de tu MacBook Air M2 vence en 30 dias', time: 'Hace 5 dias', unread: false },
];

export default function CuentadanteNotificacionesPage() {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider">Centro de Alertas</p>
      <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
      <p className="text-gray-500 mb-6">Alertas sobre tus equipos asignados</p>

      <div className="space-y-3">
        {notificaciones.map((n, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl border p-5 flex items-start gap-4 transition-colors ${
              n.unread ? 'border-l-4 border-l-green-600' : ''
            }`}
          >
            {/* Icono */}
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg shrink-0">
              {n.icon}
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold text-gray-900 ${n.unread ? '' : 'font-medium'}`}>
                  {n.title}
                </p>
                {n.unread && (
                  <span className="w-2 h-2 bg-green-600 rounded-full shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{n.desc}</p>
              <p className="text-xs text-gray-400 mt-2">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
