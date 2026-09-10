'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTickets } from '@/hooks/use-tickets';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';
import { TicketStatus } from '@/types/ticket';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function LiderTicketsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTickets({
    page,
    per_page: 15,
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Todos los Tickets</h1>
          <p className="text-gray-500">Gestion completa de tickets de soporte</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border">
        <div className="p-6 pb-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setStatusFilter(tab.key); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    statusFilter === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
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
              className="ml-auto max-w-xs px-4 py-1.5 bg-white border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y bg-gray-50/50">
                <th className="text-left p-3 pl-6 font-medium text-gray-500 text-xs uppercase">ID</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Asunto</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Solicitante</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Prioridad</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Estado</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Sede</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Asignado</th>
                <th className="text-left p-3 pr-6 font-medium text-gray-500 text-xs uppercase">Creado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={8} className="p-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : !data?.data.length ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">No hay tickets que coincidan</td>
                </tr>
              ) : (
                data.data.map((t) => {
                  const sCfg = STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG];
                  const pCfg = PRIORITY_CONFIG[t.priority as keyof typeof PRIORITY_CONFIG];
                  return (
                    <tr key={t.id} className="border-b hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 pl-6">
                        <Link href={`/lider/tickets/${t.id}`} className="font-mono font-medium text-green-700 hover:underline">
                          #{t.id}
                        </Link>
                      </td>
                      <td className="p-3 text-gray-900 font-medium max-w-[200px] truncate">{t.title}</td>
                      <td className="p-3 text-gray-600">{t.requester?.name || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pCfg?.color || ''}`}>{pCfg?.label || t.priority}</span>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sCfg?.color || ''}`}>{sCfg?.label || t.status}</span>
                      </td>
                      <td className="p-3 text-gray-600">{t.campus}</td>
                      <td className="p-3 text-gray-600">{t.assignee?.name || <span className="text-red-500 text-xs">Sin asignar</span>}</td>
                      <td className="p-3 pr-6 text-gray-500 text-xs">
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
          <div className="px-6 py-3 border-t flex items-center justify-between text-xs text-gray-500">
            <span>Pagina {data.current_page} de {data.last_page} ({data.total} tickets)</span>
            <div className="flex gap-1">
              <button
                disabled={data.current_page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 rounded border hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                disabled={data.current_page >= data.last_page}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 rounded border hover:bg-gray-50 transition-colors disabled:opacity-50"
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
