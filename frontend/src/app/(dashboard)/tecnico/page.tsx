'use client';

import { useState } from 'react';
import Link from 'next/link';

type TicketStatus = 'all' | 'open' | 'in_progress' | 'pending' | 'closed';
type TicketPriority = 'all' | 'critical' | 'high' | 'medium' | 'low';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'pending' | 'closed';
  campus: string;
  time: string;
  sla: number;
  slaRisk?: boolean;
}

const tickets: Ticket[] = [
  { id: '#TI-4592', subject: 'Falla conexion fibra optica', category: 'Redes e Infra', priority: 'critical', status: 'open', campus: 'Bucaramanga', time: 'Hace 45m', sla: 89, slaRisk: true },
  { id: '#TI-4588', subject: 'Instalacion software Lab', category: 'Software', priority: 'medium', status: 'in_progress', campus: 'Floridablanca', time: 'Hace 3h', sla: 65 },
  { id: '#TI-4581', subject: 'Error acceso plataforma notas', category: 'Soporte Web', priority: 'high', status: 'pending', campus: 'Bucaramanga', time: 'Hace 5h', sla: 45 },
  { id: '#TI-4575', subject: 'Teclado defectuoso sala 204', category: 'Hardware', priority: 'low', status: 'closed', campus: 'Barrancabermeja', time: 'Hace 8h', sla: 100 },
  { id: '#TI-4570', subject: 'Proyector sin imagen aula 101', category: 'Hardware', priority: 'high', status: 'open', campus: 'Bucaramanga', time: 'Hace 1h', sla: 82, slaRisk: true },
  { id: '#TI-4565', subject: 'VPN no conecta desde casa', category: 'Redes e Infra', priority: 'medium', status: 'in_progress', campus: 'Piedecuesta', time: 'Hace 4h', sla: 55 },
  { id: '#TI-4560', subject: 'Impresora atasca papel piso 3', category: 'Hardware', priority: 'low', status: 'pending', campus: 'Bucaramanga', time: 'Hace 6h', sla: 30 },
  { id: '#TI-4555', subject: 'Actualizacion Office licencias', category: 'Software', priority: 'critical', status: 'open', campus: 'Floridablanca', time: 'Hace 2h', sla: 91, slaRisk: true },
];

const statusLabels: Record<string, string> = {
  open: 'Abierto',
  in_progress: 'En Progreso',
  pending: 'Pendiente',
  closed: 'Cerrado',
};

const statusStyles: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-orange-100 text-orange-800',
  closed: 'bg-green-100 text-green-800',
};

const priorityLabels: Record<string, string> = {
  critical: 'Critica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

const priorityStyles: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

const categories = ['Todas', 'Redes e Infra', 'Software', 'Hardware', 'Soporte Web'];

function SlaBar({ value }: { value: number }) {
  const color = value > 70 ? 'bg-red-500' : value > 40 ? 'bg-yellow-500' : 'bg-green-500';
  const textColor = value > 70 ? 'text-red-700' : value > 40 ? 'text-yellow-700' : 'text-green-700';

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-xs font-semibold ${textColor} w-9 text-right`}>{value}%</span>
    </div>
  );
}

export default function TecnicoDashboardPage() {
  const [activeTab, setActiveTab] = useState<TicketStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority>('all');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  const tabs: { key: TicketStatus; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'open', label: 'Abiertos' },
    { key: 'in_progress', label: 'En Progreso' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'closed', label: 'Cerrados' },
  ];

  const filteredTickets = tickets.filter((t) => {
    if (activeTab !== 'all' && t.status !== activeTab) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (categoryFilter !== 'Todas' && t.category !== categoryFilter) return false;
    return true;
  });

  const slaRiskCount = tickets.filter((t) => t.sla > 80 && t.status !== 'closed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Panel</h1>
        <p className="text-gray-500 text-sm">Tecnico de Soporte &middot; Vista General</p>
      </div>

      {/* SLA Alert Banner */}
      {slaRiskCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800">Tienes {slaRiskCount} tickets con SLA en riesgo (+80%)</p>
            <p className="text-xs text-red-600 mt-0.5">Por favor, prioriza estos casos. El incumplimiento de SLA afecta los indicadores del equipo.</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Abiertos', value: '12', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-17.5 0V6.75A2.25 2.25 0 014.5 4.5h15A2.25 2.25 0 0121.75 6.75v6.75" />
            </svg>
          ), color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'En Progreso', value: '08', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
          ), color: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'Pendientes', value: '04', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ), color: 'text-orange-700', bg: 'bg-orange-50' },
          { label: 'Cerrados Hoy', value: '23', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ), color: 'text-green-700', bg: 'bg-green-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center ${stat.color} mb-2`}>
              {stat.icon}
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
            <span className="text-xs text-gray-500">{filteredTickets.length} tickets</span>
          </div>

          {/* Tabs + Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 ml-auto">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TicketPriority)}
                className="text-xs border rounded-lg px-3 py-1.5 text-gray-600 bg-white outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
              >
                <option value="all">Todas las prioridades</option>
                <option value="critical">Critica</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs border rounded-lg px-3 py-1.5 text-gray-600 bg-white outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y bg-gray-50/50">
                <th className="text-left p-3 pl-6 font-medium text-gray-500 text-xs uppercase">ID</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Asunto</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Categoria</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Prioridad</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Estado</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Sede</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Creado</th>
                <th className="text-left p-3 pr-6 font-medium text-gray-500 text-xs uppercase">SLA</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    No hay tickets que coincidan con los filtros seleccionados
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className={`border-b hover:bg-gray-50/50 transition-colors ${t.slaRisk ? 'bg-red-50/30' : ''}`}>
                    <td className="p-3 pl-6">
                      <Link href={`/tecnico/tickets/${t.id.replace('#', '')}`} className="font-mono font-medium text-green-700 hover:underline">
                        {t.id}
                      </Link>
                    </td>
                    <td className="p-3 text-gray-900 font-medium max-w-[200px] truncate">{t.subject}</td>
                    <td className="p-3 text-gray-600">{t.category}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[t.priority]}`}>
                        {priorityLabels[t.priority]}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[t.status]}`}>
                        {statusLabels[t.status]}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{t.campus}</td>
                    <td className="p-3 text-gray-500 text-xs">{t.time}</td>
                    <td className="p-3 pr-6">
                      <SlaBar value={t.sla} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex items-center justify-between text-xs text-gray-500">
          <span>Mostrando {filteredTickets.length} de {tickets.length} tickets</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border hover:bg-gray-50 transition-colors">Anterior</button>
            <button className="px-3 py-1 rounded border bg-green-700 text-white">1</button>
            <button className="px-3 py-1 rounded border hover:bg-gray-50 transition-colors">2</button>
            <button className="px-3 py-1 rounded border hover:bg-gray-50 transition-colors">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
