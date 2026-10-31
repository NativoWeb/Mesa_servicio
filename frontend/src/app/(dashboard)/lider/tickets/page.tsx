'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTickets } from '@/hooks/use-tickets';
import { STATUS_CONFIG, PRIORITY_CONFIG, CAMPUSES } from '@/lib/constants';

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const FILTER_TITLES: Record<string, { title: string; subtitle: string }> = {
  unassigned: { title: 'Tickets Sin Asignar', subtitle: 'Tickets que aun no tienen tecnico asignado' },
  escalated: { title: 'Tickets Escalonados', subtitle: 'Tickets que han sido escalados' },
  campus: { title: 'Tickets por Sede', subtitle: 'Filtra los tickets por sede de origen' },
};

export default function LiderTicketsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-[var(--surface-3)] rounded-xl" />}>
      <LiderTicketsContent />
    </Suspense>
  );
}

function LiderTicketsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sidebarFilter = searchParams.get('filter') || '';

  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [campusFilter, setCampusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setStatusFilter('');
    setPage(1);
  }, [sidebarFilter]);

  const queryParams: Record<string, string | number> = {
    page,
    per_page: 15,
    ...(!sidebarFilter && statusFilter && { status: statusFilter }),
    ...(search && { search }),
  };

  if (sidebarFilter === 'unassigned') {
    queryParams.unassigned = 1;
  } else if (sidebarFilter === 'escalated') {
    queryParams.status = 'escalated';
  } else if (sidebarFilter === 'campus' && campusFilter) {
    queryParams.campus = campusFilter;
  }

  const { data, isLoading } = useTickets(queryParams);

  const { title, subtitle } = FILTER_TITLES[sidebarFilter] || {
    title: 'Todos los Tickets',
    subtitle: 'Gestion completa de tickets de soporte',
  };

  const tabs: { key: string; label: string }[] = [
    { key: '', label: 'Todos' },
    { key: 'open', label: 'Abiertos' },
    { key: 'in_progress', label: 'En Progreso' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'closed', label: 'Cerrados' },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{title}</h1>
          <p className="text-[var(--muted)] mt-1.5">{subtitle}</p>
        </div>
      </div>
      <div className="nw-card">
        <div className="toolbar">
            {!sidebarFilter && (
              <div className="seg">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setStatusFilter(tab.key); setPage(1); }}
                    className={statusFilter === tab.key ? 'on' : ''}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
            {sidebarFilter === 'campus' && (
              <select
                value={campusFilter}
                onChange={(e) => { setCampusFilter(e.target.value); setPage(1); }}
                className="px-3 py-1.5 bg-[var(--surface)] border rounded-lg text-sm outline-none focus:shadow-[var(--focus)]"
              >
                <option value="">Selecciona una sede</option>
                {CAMPUSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por titulo..."
              className="nw-input ml-auto"
              style={{ maxWidth: '280px' }}
            />
        </div>

        <div className="overflow-x-auto">
          <table className="nw-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Asunto</th>
                <th>Solicitante</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Sede</th>
                <th>Asignado</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8}><div className="h-4 bg-[var(--surface-3)] rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : !data?.data.length ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[var(--faint)]">No hay tickets que coincidan</td>
                </tr>
              ) : (
                data.data.map((t) => {
                  const sCfg = STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG];
                  const pCfg = PRIORITY_CONFIG[t.priority as keyof typeof PRIORITY_CONFIG];
                  return (
                    <tr
                      key={t.id}
                      onClick={() => router.push(`/lider/tickets/${t.id}`)}
                      className="cursor-pointer"
                    >
                      <td>
                        <span className="font-mono font-medium text-[var(--selva-500)]">
                          #{t.id}
                        </span>
                      </td>
                      <td className="text-[var(--ink)] font-medium max-w-[200px] truncate">{t.title}</td>
                      <td className="text-[var(--ink-2)]">{t.requester?.name || 'N/A'}</td>
                      <td>
                        <span className={`nw-badge ${pCfg?.color || ''}`}>{pCfg?.label || t.priority}</span>
                      </td>
                      <td>
                        <span className={`nw-badge ${sCfg?.color || ''}`}>{sCfg?.label || t.status}</span>
                      </td>
                      <td className="text-[var(--ink-2)]">{t.campus}</td>
                      <td className="text-[var(--ink-2)]">{t.assignee?.name || <span className="text-[var(--crit)] text-xs">Sin asignar</span>}</td>
                      <td className="text-[var(--muted)] text-xs">
                        {formatDistanceToNow(new Date(t.created_at), { locale: es, addSuffix: true })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {data && data.last_page > 1 && (
          <div className="pager">
            <span>Página {data.current_page} de {data.last_page} ({data.total} tickets)</span>
            <div className="pages">
              <button
                disabled={data.current_page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                ‹
              </button>
              <button
                disabled={data.current_page >= data.last_page}
                onClick={() => setPage(p => p + 1)}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
