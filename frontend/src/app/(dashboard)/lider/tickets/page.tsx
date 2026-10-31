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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)]">{title}</h1>
          <p className="text-[var(--muted)]">{subtitle}</p>
        </div>
      </div>
      <div className="bg-[var(--surface)] rounded-xl border">
        <div className="p-6 pb-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {!sidebarFilter && (
              <div className="flex gap-1 bg-[var(--surface-3)] rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setStatusFilter(tab.key); setPage(1); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      statusFilter === tab.key ? 'bg-[var(--surface)] text-[var(--ink)] shadow-[var(--sh-1)]' : 'text-[var(--muted)] hover:text-[var(--ink-2)]'
                    }`}
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
              className="ml-auto max-w-xs px-4 py-1.5 bg-[var(--surface)] border rounded-lg text-sm outline-none focus:shadow-[var(--focus)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-[var(--surface-2)]">
                <th className="text-left p-3 pl-6 font-semibold text-[var(--muted)] text-xs">ID</th>
                <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs">Asunto</th>
                <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs">Solicitante</th>
                <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs">Prioridad</th>
                <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs">Estado</th>
                <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs">Sede</th>
                <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs">Asignado</th>
                <th className="text-left p-3 pr-6 font-semibold text-[var(--muted)] text-xs">Creado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={8} className="p-3"><div className="h-4 bg-[var(--surface-3)] rounded animate-pulse" /></td>
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
                      className="border-b hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                    >
                      <td className="p-3 pl-6">
                        <span className="font-mono font-medium text-[var(--selva-500)]">
                          #{t.id}
                        </span>
                      </td>
                      <td className="p-3 text-[var(--ink)] font-medium max-w-[200px] truncate">{t.title}</td>
                      <td className="p-3 text-[var(--ink-2)]">{t.requester?.name || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pCfg?.color || ''}`}>{pCfg?.label || t.priority}</span>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sCfg?.color || ''}`}>{sCfg?.label || t.status}</span>
                      </td>
                      <td className="p-3 text-[var(--ink-2)]">{t.campus}</td>
                      <td className="p-3 text-[var(--ink-2)]">{t.assignee?.name || <span className="text-[var(--crit)] text-xs">Sin asignar</span>}</td>
                      <td className="p-3 pr-6 text-[var(--muted)] text-xs">
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
          <div className="px-6 py-3 border-t flex items-center justify-between text-xs text-[var(--muted)]">
            <span>Pagina {data.current_page} de {data.last_page} ({data.total} tickets)</span>
            <div className="flex gap-1">
              <button
                disabled={data.current_page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 rounded border hover:bg-[var(--surface-2)] transition-colors disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                disabled={data.current_page >= data.last_page}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 rounded border hover:bg-[var(--surface-2)] transition-colors disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
