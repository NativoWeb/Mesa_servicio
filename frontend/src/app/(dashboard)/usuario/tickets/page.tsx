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

// Mock data as fallback
const mockTickets = [
  { id: 42, ticket_number: 'T-0042', category: 'Redes/Conectividad', title: 'Falla de internet en el aula 203', priority: 'high' as const, status: 'in_progress' as const, created_at: '2024-05-24T00:00:00Z', assigned_user: { name: 'Andrés Gómez' }, campus: '', location: '', description: '', requester_id: 0, assigned_to: null },
  { id: 45, ticket_number: 'T-0045', category: 'Hardware', title: 'Impresora no reconoce tóner', priority: 'medium' as const, status: 'open' as const, created_at: '2024-05-23T00:00:00Z', assigned_user: null, campus: '', location: '', description: '', requester_id: 0, assigned_to: null },
];

const priorityConfig = {
  low: { label: 'Baja', color: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
  medium: { label: 'Media', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  high: { label: 'Alta', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  critical: { label: 'Crítica', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

const statusConfig = {
  open: { label: 'Abierto', color: 'bg-yellow-100 text-yellow-800' },
  in_progress: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
  pending: { label: 'Pendiente', color: 'bg-orange-100 text-orange-800' },
  closed: { label: 'Cerrado', color: 'bg-green-100 text-green-800' },
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
      // Fallback to mock data if API fails
      setTickets(mockTickets);
      setCurrentPage(1);
      setLastPage(1);
      setTotal(mockTickets.length);
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
          <h1 className="text-2xl font-bold text-gray-900">Mis Tickets</h1>
          <p className="text-gray-500 text-sm">Tienes {activeCount} tickets activos</p>
        </div>
        <Link href="/usuario/tickets/nuevo" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5">
          <span className="text-lg leading-none">+</span> Crear nuevo ticket
        </Link>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-white rounded-xl border p-1 gap-0.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${filter === f.key ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
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
            className="w-full px-4 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <svg className="animate-spin h-8 w-8 mx-auto text-green-700 mb-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          <p className="text-sm text-gray-500">Cargando tickets...</p>
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
                className="bg-white rounded-xl border p-5 hover:shadow-md hover:border-green-200 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono font-bold text-gray-900">{displayId}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${pConfig.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${pConfig.dot}`} />
                    {pConfig.label}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t.category}</p>
                <h3 className="font-medium text-gray-900 mt-1 text-sm leading-snug group-hover:text-green-800 transition-colors">{t.title}</h3>
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${sConfig.color}`}>
                    {sConfig.label}
                  </span>
                  <span className="text-xs text-gray-400">{dateStr}</span>
                </div>
                {assigneeName && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-[10px] font-bold">
                      {assigneeName.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    {assigneeName}
                    <span className="ml-auto text-green-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Ver detalle ›</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No se encontraron tickets</p>
          <p className="text-sm mt-1">Intenta con otro filtro o término de búsqueda</p>
          <Link href="/usuario/tickets/nuevo" className="inline-block mt-4 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            Crear tu primer ticket
          </Link>
        </div>
      )}

      {/* Pagination */}
      {!loading && lastPage > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Página {currentPage} de {lastPage} ({total} tickets)</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => currentPage > 1 && fetchTickets(currentPage - 1)}
              disabled={currentPage <= 1}
              className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
            >‹</button>
            {Array.from({ length: lastPage }, (_, i) => i + 1).slice(0, 5).map((p) => (
              <button
                key={p}
                onClick={() => fetchTickets(p)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium ${p === currentPage ? 'bg-green-700 text-white' : 'border hover:bg-gray-50'}`}
              >{p}</button>
            ))}
            <button
              onClick={() => currentPage < lastPage && fetchTickets(currentPage + 1)}
              disabled={currentPage >= lastPage}
              className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
            >›</button>
          </div>
        </div>
      )}
    </div>
  );
}
