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

const DESC_COLORS: Record<string, string> = {
  created: 'bg-[var(--low-bg)] text-[var(--low)]',
  updated: 'bg-[var(--info-bg)] text-[var(--info)]',
  deleted: 'bg-[var(--crit-bg)] text-[var(--crit)]',
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
      <div className="page-head">
        <div>
          <h1>Logs de Auditoría</h1>
          <p>Registro detallado de todas las acciones del sistema</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Buscar en descripción..."
          className="nw-input flex-1 max-w-xs"
        />
        <select
          value={subjectFilter}
          onChange={(e) => { setSubjectFilter(e.target.value); setPage(1); }}
          className="nw-input w-auto min-w-[160px]"
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
          className="nw-input w-auto"
          placeholder="Desde"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          className="nw-input w-auto"
          placeholder="Hasta"
        />
        <button onClick={handleReset} className="nw-btn sm">
          Resetear
        </button>
      </div>

      <div className="nw-card overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12 text-[var(--faint)]">Cargando logs...</div>
        ) : isError ? (
          <div className="text-center py-12 text-[var(--crit)]">Error al cargar los logs de auditoría</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="nw-table w-full">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Tipo</th>
                    <th>Cambios</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((log) => (
                      <tr key={log.id}>
                        <td className="font-mono text-xs text-[var(--muted)] whitespace-nowrap">{formatDate(log.created_at)}</td>
                        <td className="font-medium text-[var(--ink)]">{log.causer?.name || 'Sistema'}</td>
                        <td>
                          <span className={`nw-badge ${DESC_COLORS[log.description] || 'bg-[var(--surface-3)] text-[var(--ink-2)]'}`}>
                            {formatDescription(log.description)}
                          </span>
                        </td>
                        <td className="text-[var(--ink-2)]">{formatSubjectType(log.subject_type)}</td>
                        <td className="text-[var(--muted)] max-w-xs truncate text-xs">
                          {log.properties && Object.keys(log.properties).length > 0
                            ? JSON.stringify(log.properties.attributes || log.properties)
                            : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-[var(--faint)]">No se encontraron registros</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {data && data.last_page > 1 && (
              <div className="pager">
                <span>
                  Página {data.current_page} de {data.last_page} ({data.total} registros)
                </span>
                <div className="pages">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={data.current_page <= 1}
                  >
                    ‹
                  </button>
                  {Array.from({ length: Math.min(data.last_page, 5) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={p === data.current_page ? 'on' : ''}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
                    disabled={data.current_page >= data.last_page}
                  >
                    ›
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
