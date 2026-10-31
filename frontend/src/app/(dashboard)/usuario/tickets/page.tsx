'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

type FilterStatus = 'all' | 'open' | 'in_progress' | 'pending' | 'closed';

interface Ticket {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'pending' | 'closed';
  campus: string;
  location: string;
  requester_id: number;
  assigned_to: number | null;
  assigned_user?: { name: string } | null;
  created_at: string;
}

const priorityConfig = {
  low: { label: 'Baja', color: 'bg-[var(--surface-3)] text-[var(--ink-2)]', dot: 'bg-[var(--faint)]' },
  medium: { label: 'Media', color: 'bg-[var(--med-bg)] text-[var(--med)]', dot: 'bg-[var(--med)]' },
  high: { label: 'Alta', color: 'bg-[var(--high-bg)] text-[var(--high)]', dot: 'bg-[var(--high)]' },
  critical: { label: 'Crítica', color: 'bg-[var(--crit-bg)] text-[var(--crit)]', dot: 'bg-[var(--crit)]' },
};

const statusConfig = {
  open: { label: 'Abierto', color: 'bg-[var(--med-bg)] text-[var(--med)]' },
  in_progress: { label: 'En Progreso', color: 'bg-[var(--info-bg)] text-[var(--info)]' },
  pending: { label: 'Pendiente', color: 'bg-[var(--high-bg)] text-[var(--high)]' },
  closed: { label: 'Cerrado', color: 'bg-[var(--low-bg)] text-[var(--selva-500)]' },
};

const filters: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'open', label: 'Abiertos' },
  { key: 'in_progress', label: 'En Progreso' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'closed', label: 'Cerrados' },
];

export default function MisTicketsPage() {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTickets = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page };
      if (filter !== 'all') params.status = filter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/tickets', { params });
      const data = res.data;

      setTickets(data.data || []);
      setCurrentPage(data.current_page || 1);
      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
    } catch {
      setTickets([]);
      setCurrentPage(1);
      setLastPage(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchTickets(1);
    }, search ? 400 : 0);
    return () => clearTimeout(debounce);
  }, [fetchTickets]);

  const filtered = tickets;
  const activeCount = tickets.filter((t) => t.status !== 'closed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)]">Mis Tickets</h1>
          <p className="text-[var(--muted)] text-sm">Tienes {activeCount} tickets activos</p>
        </div>
        <Link href="/usuario/tickets/nuevo" className="bg-[var(--lima-500)] hover:bg-[var(--lima-400)] text-[var(--lima-ink)] px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5">
          <span className="text-lg leading-none">+</span> Crear nuevo ticket
        </Link>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-[var(--surface)] rounded-xl border border-[var(--line)] p-1 gap-0.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${filter === f.key ? 'bg-[var(--lima-500)] text-[var(--lima-ink)]' : 'text-[var(--ink-2)] hover:bg-[var(--surface-3)]'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-xs">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID o descripción..."
            className="w-full px-4 py-2 bg-[var(--surface)] border border-[var(--line)] rounded-xl text-sm outline-none focus:shadow-[var(--focus)]"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <svg className="animate-spin h-8 w-8 mx-auto text-[var(--selva-500)] mb-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          <p className="text-sm text-[var(--muted)]">Cargando tickets...</p>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => {
            const displayId = `#${t.ticket_number || `T-${String(t.id).padStart(4, '0')}`}`;
            const assigneeName = t.assigned_user?.name || null;
            const dateStr = new Date(t.created_at).toLocaleDateString('es-CO');
            const pConfig = priorityConfig[t.priority] || priorityConfig.medium;
            const sConfig = statusConfig[t.status] || statusConfig.open;

            return (
              <Link
                key={t.id}
                href={`/usuario/tickets/${t.id}`}
                className="bg-[var(--surface)] rounded-xl border border-[var(--line)] p-5 hover:shadow-md hover:border-[var(--line-2)] transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono font-bold text-[var(--ink)]">{displayId}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${pConfig.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${pConfig.dot}`} />
                    {pConfig.label}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--faint)] uppercase tracking-wider">{t.category}</p>
                <h3 className="font-medium text-[var(--ink)] mt-1 text-sm leading-snug group-hover:text-[var(--selva-500)] transition-colors">{t.title}</h3>
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${sConfig.color}`}>
                    {sConfig.label}
                  </span>
                  <span className="text-xs text-[var(--faint)]">{dateStr}</span>
                </div>
                {assigneeName && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--muted)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--low-bg)] flex items-center justify-center text-[var(--selva-500)] text-[10px] font-bold">
                      {assigneeName.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    {assigneeName}
                    <span className="ml-auto text-[var(--selva-500)] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Ver detalle ›</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--faint)]">
          <p className="text-lg">No se encontraron tickets</p>
          <p className="text-sm mt-1">Intenta con otro filtro o término de búsqueda</p>
          <Link href="/usuario/tickets/nuevo" className="inline-block mt-4 bg-[var(--lima-500)] hover:bg-[var(--lima-400)] text-[var(--lima-ink)] px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            Crear tu primer ticket
          </Link>
        </div>
      )}

      {/* Pagination */}
      {!loading && lastPage > 1 && (
        <div className="flex items-center justify-between text-sm text-[var(--muted)]">
          <span>Página {currentPage} de {lastPage} ({total} tickets)</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => currentPage > 1 && fetchTickets(currentPage - 1)}
              disabled={currentPage <= 1}
              className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center hover:bg-[var(--surface-2)] disabled:opacity-40"
            >‹</button>
            {Array.from({ length: lastPage }, (_, i) => i + 1).slice(0, 5).map((p) => (
              <button
                key={p}
                onClick={() => fetchTickets(p)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium ${p === currentPage ? 'bg-[var(--lima-500)] text-[var(--lima-ink)]' : 'border border-[var(--line)] hover:bg-[var(--surface-2)]'}`}
              >{p}</button>
            ))}
            <button
              onClick={() => currentPage < lastPage && fetchTickets(currentPage + 1)}
              disabled={currentPage >= lastPage}
              className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center hover:bg-[var(--surface-2)] disabled:opacity-40"
            >›</button>
          </div>
        </div>
      )}
    </div>
  );
}
