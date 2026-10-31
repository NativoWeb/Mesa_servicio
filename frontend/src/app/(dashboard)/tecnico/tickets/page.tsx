'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTickets } from '@/hooks/use-tickets';
import { useAuthStore } from '@/stores/auth-store';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TecnicoTicketsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-[var(--surface-3)] rounded-xl" />}>
      <TecnicoTicketsContent />
    </Suspense>
  );
}

function TecnicoTicketsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const statusFilter = searchParams.get('status') || '';
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useTickets({
    page,
    per_page: 15,
    ...(user?.id && { assigned_to: user.id }),
    ...(statusFilter && { status: statusFilter }),
    ...(search && { search }),
  });

  const tabs: { key: string; label: string }[] = [
    { key: '', label: 'Todos' },
    { key: 'open', label: 'Abiertos' },
    { key: 'in_progress', label: 'En Progreso' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'closed', label: 'Cerrados' },
  ];

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[var(--crit)] font-medium mb-2">Error al cargar los tickets</p>
          <p className="text-sm text-[var(--muted)]">{(error as Error)?.message || 'Intenta recargar la pagina'}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)]">Mis Tickets Asignados</h1>
          <p className="text-[var(--muted)]">Tickets de soporte asignados a ti</p>
        </div>
      </div>
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--line)]">
        <div className="p-6 pb-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex gap-1 bg-[var(--surface-3)] rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setPage(1);
                    router.push(tab.key ? `/tecnico/tickets?status=${tab.key}` : '/tecnico/tickets');
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    statusFilter === tab.key ? 'bg-[var(--surface)] text-[var(--ink)] shadow-[var(--sh-1)]' : 'text-[var(--muted)] hover:text-[var(--ink-2)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por titulo..."
              className="ml-auto max-w-xs px-4 py-1.5 bg-[var(--surface)] border border-[var(--line)] rounded-lg text-sm outline-none focus:shadow-[var(--focus)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-[var(--line)] bg-[var(--surface-2)]">
                <th className="text-left p-3 pl-6 font-semibold text-[var(--muted)] text-xs uppercase">ID</th>
                <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs uppercase">Asunto</th>
                <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs uppercase">Solicitante</th>
                <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs uppercase">Prioridad</th>
                <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs uppercase">Estado</th>
                <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs uppercase">Sede</th>
                <th className="text-left p-3 pr-6 font-semibold text-[var(--muted)] text-xs uppercase">Creado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={7} className="p-3"><div className="h-4 bg-[var(--surface-3)] rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : !data?.data.length ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[var(--faint)]">No tienes tickets asignados</td>
                </tr>
              ) : (
                data.data.map((t) => {
                  const sCfg = STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG];
                  const pCfg = PRIORITY_CONFIG[t.priority as keyof typeof PRIORITY_CONFIG];
                  return (
                    <tr
                      key={t.id}
                      onClick={() => router.push(`/tecnico/tickets/${t.id}`)}
                      className="border-b border-[var(--line)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
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
          <div className="px-6 py-3 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--muted)]">
            <span>Pagina {data.current_page} de {data.last_page} ({data.total} tickets)</span>
            <div className="flex gap-1">
              <button
                disabled={data.current_page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 rounded border border-[var(--line)] hover:bg-[var(--surface-2)] transition-colors disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                disabled={data.current_page >= data.last_page}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 rounded border border-[var(--line)] hover:bg-[var(--surface-2)] transition-colors disabled:opacity-50"
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
