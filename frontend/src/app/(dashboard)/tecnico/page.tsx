'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTickets } from '@/hooks/use-tickets';
import { useDashboard } from '@/hooks/use-dashboard';
import { useAuthStore } from '@/stores/auth-store';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

type FilterStatus = '' | 'open' | 'in_progress' | 'pending' | 'closed';

export default function TecnicoDashboardPage() {
  const user = useAuthStore(s => s.user);
  const [activeTab, setActiveTab] = useState<FilterStatus>('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data: dashboard } = useDashboard();
  const { data: ticketsData, isLoading } = useTickets({
    assigned_to: user?.id ?? 0,
    page,
    per_page: 15,
    ...(activeTab && { status: activeTab }),
    ...(priorityFilter && { priority: priorityFilter }),
  });

  const my = dashboard?.my_tickets;

  const tabs: { key: FilterStatus; label: string }[] = [
    { key: '', label: 'Todos' },
    { key: 'open', label: 'Abiertos' },
    { key: 'in_progress', label: 'En Progreso' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'closed', label: 'Cerrados' },
  ];

  const kpis = [
    { label: 'Abiertos', value: my?.open ?? '-', color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'En Progreso', value: my?.in_progress ?? '-', color: 'text-yellow-700', bg: 'bg-yellow-50' },
    { label: 'Pendientes', value: my?.pending ?? '-', color: 'text-orange-700', bg: 'bg-orange-50' },
    { label: 'Cerrados Hoy', value: my?.closed_today ?? '-', color: 'text-green-700', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Panel</h1>
        <p className="text-gray-500 text-sm">Tecnico de Soporte &middot; Vista General</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center ${stat.color} mb-2`}>
              <div className="w-3 h-3 rounded-full bg-current" />
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl border">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-lg">Mis Tickets Asignados</h2>
            <span className="text-xs text-gray-500">{ticketsData?.total ?? 0} tickets</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
              className="ml-auto text-xs border rounded-lg px-3 py-1.5 text-gray-600 bg-white outline-none focus:ring-2 focus:ring-green-500/20"
            >
              <option value="">Todas las prioridades</option>
              {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y bg-gray-50/50">
                <th className="text-left p-3 pl-6 font-medium text-gray-500 text-xs uppercase">ID</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Asunto</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Prioridad</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Estado</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Sede</th>
                <th className="text-left p-3 pr-6 font-medium text-gray-500 text-xs uppercase">Creado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b"><td colSpan={6} className="p-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : !ticketsData?.data.length ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No hay tickets asignados con los filtros seleccionados
                  </td>
                </tr>
              ) : (
                ticketsData.data.map((t) => {
                  const sCfg = STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG];
                  const pCfg = PRIORITY_CONFIG[t.priority as keyof typeof PRIORITY_CONFIG];
                  return (
                    <tr key={t.id} className="border-b hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 pl-6">
                        <Link href={`/tecnico/tickets/${t.id}`} className="font-mono font-medium text-green-700 hover:underline">
                          #{t.id}
                        </Link>
                      </td>
                      <td className="p-3 text-gray-900 font-medium max-w-[250px] truncate">{t.title}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pCfg?.color || ''}`}>{pCfg?.label || t.priority}</span>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sCfg?.color || ''}`}>{sCfg?.label || t.status}</span>
                      </td>
                      <td className="p-3 text-gray-600">{t.campus}</td>
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

        {ticketsData && ticketsData.last_page > 1 && (
          <div className="px-6 py-3 border-t flex items-center justify-between text-xs text-gray-500">
            <span>Pagina {ticketsData.current_page} de {ticketsData.last_page}</span>
            <div className="flex gap-1">
              <button disabled={ticketsData.current_page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50">Anterior</button>
              <button disabled={ticketsData.current_page >= ticketsData.last_page} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
