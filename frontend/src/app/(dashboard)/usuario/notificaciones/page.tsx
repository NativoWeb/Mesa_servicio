'use client';

import { useState } from 'react';
import { useNotifications, Notification } from '@/hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

function subjectIcon(subjectType: string) {
  if (subjectType.includes('Ticket')) return 'T';
  if (subjectType.includes('Asset')) return 'A';
  if (subjectType.includes('Maintenance')) return 'M';
  return 'N';
}

function subjectColor(subjectType: string) {
  if (subjectType.includes('Ticket')) return 'bg-blue-100 text-blue-700';
  if (subjectType.includes('Asset')) return 'bg-green-100 text-green-700';
  if (subjectType.includes('Maintenance')) return 'bg-orange-100 text-orange-700';
  return 'bg-gray-100 text-gray-700';
}

function subjectLabel(subjectType: string) {
  if (subjectType.includes('Ticket')) return 'Ticket';
  if (subjectType.includes('Asset')) return 'Activo';
  if (subjectType.includes('Maintenance')) return 'Mantenimiento';
  return 'Actividad';
}

export default function NotificacionesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotifications({ page, per_page: 20 });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
      <p className="text-gray-500 mb-6">Actualizaciones sobre tus solicitudes de soporte</p>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-5">
              <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2 mt-2" />
            </div>
          ))
        ) : !data?.data.length ? (
          <div className="bg-white rounded-xl border p-6">
            <div className="text-center py-12 text-gray-400">No tienes notificaciones por el momento</div>
          </div>
        ) : (
          data.data.map((n: Notification) => (
            <div
              key={n.id}
              className="bg-white rounded-xl border p-5 flex items-start gap-4 hover:shadow-sm transition-shadow"
            >
              {/* Icono */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${subjectColor(n.subject_type)}`}>
                {subjectIcon(n.subject_type)}
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {subjectLabel(n.subject_type)}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 mt-1">{n.description}</p>
                {n.causer && (
                  <p className="text-xs text-gray-500 mt-1">Por: {n.causer.name}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(n.created_at), { locale: es, addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginacion */}
      {data && data.last_page > 1 && (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>Pagina {data.current_page} de {data.last_page} ({data.total} notificaciones)</span>
          <div className="flex gap-1">
            <button
              disabled={data.current_page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              disabled={data.current_page >= data.last_page}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
