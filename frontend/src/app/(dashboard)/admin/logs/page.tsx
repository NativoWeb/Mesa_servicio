'use client';

import { useState } from 'react';
import { useAuditLogs } from '@/hooks/use-audit-logs';

const SUBJECT_LABELS: Record<string, string> = {
  'App\\Models\\User': 'Usuario',
  'App\\Models\\Ticket': 'Ticket',
  'App\\Models\\Asset': 'Activo',
  'App\\Models\\Maintenance': 'Mantenimiento',
};

function formatSubjectType(type: string | null): string {
  if (!type) return '-';
  return SUBJECT_LABELS[type] || type.split('\\').pop() || type;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

const DESCRIPTION_LABELS: Record<string, string> = {
  created: 'Creado',
  updated: 'Actualizado',
  deleted: 'Eliminado',
};

function formatDescription(desc: string): string {
  return DESCRIPTION_LABELS[desc] || desc;
}

export default function AdminLogsPage() {
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const params: Record<string, string | number> = { page };
  if (search) params.search = search;
  if (subjectFilter) params.subject_type = subjectFilter;
  if (dateFrom) params.from = dateFrom;
  if (dateTo) params.to = dateTo;

  const { data, isLoading, isError } = useAuditLogs(params);

  const handleReset = () => {
    setSearch('');
    setSubjectFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logs de Auditoria</h1>
          <p className="text-gray-500 text-sm">Registro detallado de todas las acciones del sistema</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Buscar en descripcion..."
          className="flex-1 max-w-xs px-4 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20"
        />
        <select
          value={subjectFilter}
          onChange={(e) => { setSubjectFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-white border rounded-xl text-sm outline-none"
        >
          <option value="">Todos los tipos</option>
          <option value="User">Usuario</option>
          <option value="Ticket">Ticket</option>
          <option value="Asset">Activo</option>
          <option value="Maintenance">Mantenimiento</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-white border rounded-xl text-sm outline-none"
          placeholder="Desde"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-white border rounded-xl text-sm outline-none"
          placeholder="Hasta"
        />
        <button onClick={handleReset} className="text-sm text-gray-500 hover:text-gray-700">
          Resetear
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Cargando logs...</div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">Error al cargar los logs de auditoria</div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Fecha</th>
                  <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Usuario</th>
                  <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Accion</th>
                  <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Tipo</th>
                  <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Cambios</th>
                </tr>
              </thead>
              <tbody>
                {data?.data && data.data.length > 0 ? (
                  data.data.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 font-mono text-xs text-gray-500">{formatDate(log.created_at)}</td>
                      <td className="p-3 text-xs font-medium text-gray-900">{log.causer?.name || 'Sistema'}</td>
                      <td className="p-3">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-700">
                          {formatDescription(log.description)}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-gray-600">{formatSubjectType(log.subject_type)}</td>
                      <td className="p-3 text-xs text-gray-500 max-w-xs truncate">
                        {log.properties && Object.keys(log.properties).length > 0
                          ? JSON.stringify(log.properties.attributes || log.properties)
                          : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">No se encontraron registros</td>
                  </tr>
                )}
              </tbody>
            </table>

            {data && data.last_page > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <span className="text-xs text-gray-500">
                  Pagina {data.current_page} de {data.last_page} ({data.total} registros)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={data.current_page <= 1}
                    className="px-3 py-1 border rounded text-xs disabled:opacity-50 hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
                    disabled={data.current_page >= data.last_page}
                    className="px-3 py-1 border rounded text-xs disabled:opacity-50 hover:bg-gray-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
