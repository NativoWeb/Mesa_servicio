'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '@/hooks/use-dashboard';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const PRIORITY_HEX: Record<string, string> = {
  critical: '#cf3b35',
  high: '#e2742a',
  medium: '#c99a0e',
  low: '#2f8f57',
};

export default function LiderDashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-[var(--line)] rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[var(--surface)] rounded-xl border p-4 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { tickets, tickets_by_priority, tickets_weekly, technician_workload, unassigned_tickets } = data;

  const priorityData = Object.entries(tickets_by_priority || {}).map(([key, value]) => ({
    name: PRIORITY_CONFIG[key as keyof typeof PRIORITY_CONFIG]?.label || key,
    value,
    color: PRIORITY_HEX[key] || '#9CA3AF',
  }));
  const totalPriority = priorityData.reduce((s, d) => s + d.value, 0);

  const criticalOpen = (tickets_by_priority?.critical || 0) + (tickets_by_priority?.high || 0);
  const slaRate = tickets.total > 0 ? Math.round(((tickets.closed) / Math.max(tickets.total, 1)) * 100) : 0;

  const kpis = [
    { label: 'Tickets Abiertos', value: tickets.open, color: 'text-[var(--info)]', bg: 'bg-[var(--info-bg)]' },
    { label: 'En Progreso', value: tickets.in_progress, color: 'text-[var(--med)]', bg: 'bg-[var(--med-bg)]' },
    { label: 'Resueltos', value: tickets.closed, color: 'text-[var(--selva-500)]', bg: 'bg-[var(--low-bg)]' },
    { label: 'Tasa Resolución', value: `${slaRate}%`, color: 'text-[var(--selva-500)]', bg: 'bg-[var(--low-bg)]' },
    { label: 'Críticos/Altos Abiertos', value: criticalOpen, color: 'text-[var(--crit)]', bg: 'bg-[var(--crit-bg)]' },
  ];

  const maxCapacity = 20;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">Panel de Control — Mesa de Servicio TI</h1>
        <p className="text-[var(--muted)] text-sm">Semana Actual</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((stat) => (
          <div key={stat.label} className="bg-[var(--surface)] rounded-xl border p-4 hover:shadow-[var(--sh-1)] transition-shadow">
            <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center text-sm mb-1`}>
              <div className={`w-3 h-3 rounded-full ${stat.bg}`} />
            </div>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] text-[var(--muted)] uppercase tracking-wider mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Donut */}
        <div className="bg-[var(--surface)] rounded-xl border p-6">
          <h2 className="font-semibold text-[var(--ink)] mb-4">Tickets por prioridad</h2>
          {totalPriority > 0 ? (
            <div className="flex items-center gap-6">
              <div className="relative">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={priorityData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={2} stroke="#fff">
                      {priorityData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[var(--ink)]">{totalPriority}</p>
                    <p className="text-[10px] text-[var(--muted)] uppercase">Total</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {priorityData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-sm text-[var(--ink-2)]">{d.name}</span>
                    <span className="text-sm font-semibold text-[var(--ink)] ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[var(--faint)] text-center py-8">Sin datos de tickets</p>
          )}
        </div>

        {/* Weekly Bar Chart */}
        <div className="bg-[var(--surface)] rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--ink)]">Tickets (Ultimos 7 dias)</h2>
            <span className="text-xs text-[var(--muted)] bg-[var(--surface-3)] px-2 py-1 rounded">Semana Actual</span>
          </div>
          {tickets_weekly && tickets_weekly.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={tickets_weekly} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Bar dataKey="creados" fill="#E8E5E0" radius={[4, 4, 0, 0]} name="Creados" />
                <Bar dataKey="resueltos" fill="#CDDC39" radius={[4, 4, 0, 0]} name="Resueltos" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[var(--faint)] text-center py-8">Sin datos semanales</p>
          )}
        </div>
      </div>

      {/* Technician Workload + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technician Workload */}
        <div className="bg-[var(--surface)] rounded-xl border p-6">
          <h2 className="font-semibold text-[var(--ink)] mb-4">Carga Operativa por Técnico</h2>
          {technician_workload && technician_workload.length > 0 ? (
            <div className="space-y-3">
              {technician_workload.map((tech) => {
                const pct = Math.min(Math.round((tech.open_tickets / maxCapacity) * 100), 100);
                const barColor = pct > 80 ? 'bg-[var(--crit)]' : pct > 50 ? 'bg-[var(--med)]' : 'bg-[var(--selva-500)]';
                return (
                  <div key={tech.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--low-bg)] flex items-center justify-center text-[var(--selva-500)] text-xs font-bold shrink-0">
                      {tech.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[var(--ink)] truncate">{tech.name}</span>
                        <span className="text-xs text-[var(--muted)]">{tech.open_tickets} Tickets</span>
                      </div>
                      <div className="w-full bg-[var(--surface-3)] rounded-full h-2">
                        <div className={`h-2 rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${pct > 80 ? 'bg-[var(--crit-bg)] text-[var(--crit)]' : pct > 50 ? 'bg-[var(--med-bg)] text-[var(--med)]' : 'bg-[var(--low-bg)] text-[var(--selva-500)]'}`}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[var(--faint)] text-center py-8">No hay tecnicos registrados</p>
          )}
        </div>

        {/* General Stats */}
        <div className="bg-[var(--surface)] rounded-xl border p-6">
          <h2 className="font-semibold text-[var(--ink)] mb-4">Resumen General</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--info-bg)] rounded-lg p-4">
              <p className="text-xs text-[var(--info)] uppercase">Total Activos</p>
              <p className="text-2xl font-bold text-[var(--info)]">{data.assets.total}</p>
            </div>
            <div className="bg-[var(--low-bg)] rounded-lg p-4">
              <p className="text-xs text-[var(--selva-500)] uppercase">Activos Operativos</p>
              <p className="text-2xl font-bold text-[var(--selva-500)]">{data.assets.operational}</p>
            </div>
            <div className="bg-[var(--med-bg)] rounded-lg p-4">
              <p className="text-xs text-[var(--med)] uppercase">Mantenimientos Mes</p>
              <p className="text-2xl font-bold text-[var(--med)]">{data.maintenances.pending_this_month}</p>
            </div>
            <div className="bg-[var(--violet-bg)] rounded-lg p-4">
              <p className="text-xs text-[var(--violet)] uppercase">Usuarios</p>
              <p className="text-2xl font-bold text-[var(--violet)]">{data.users.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unassigned Queue */}
      <div className="bg-[var(--surface)] rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-[var(--ink)]">Cola de Espera: Tickets sin asignar</h2>
            <p className="text-xs text-[var(--muted)]">Priorizacion por tiempo de espera</p>
          </div>
          {unassigned_tickets && unassigned_tickets.length > 0 && (
            <span className="text-sm font-semibold text-[var(--crit)] bg-[var(--crit-bg)] px-3 py-1 rounded-full">
              {unassigned_tickets.length} sin asignar
            </span>
          )}
        </div>
        {unassigned_tickets && unassigned_tickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[var(--surface-2)]">
                  <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs">ID Ticket</th>
                  <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs">Solicitante / Sede</th>
                  <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs">Asunto</th>
                  <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs">Prioridad</th>
                  <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs">Esperando</th>
                  <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs">Accion</th>
                </tr>
              </thead>
              <tbody>
                {unassigned_tickets.map((t) => {
                  const priorityCfg = PRIORITY_CONFIG[t.priority as keyof typeof PRIORITY_CONFIG];
                  return (
                    <tr key={t.id} className="border-b hover:bg-[var(--surface-2)] transition-colors">
                      <td className="p-3 font-mono font-medium text-[var(--ink)]">#{t.id}</td>
                      <td className="p-3">
                        <p className="font-medium text-[var(--ink)]">{t.requester?.name || 'N/A'}</p>
                        <p className="text-xs text-[var(--muted)]">{t.campus}</p>
                      </td>
                      <td className="p-3 text-[var(--ink-2)] max-w-xs truncate">{t.title}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityCfg?.color || 'bg-[var(--surface-3)] text-[var(--ink-2)]'}`}>
                          {priorityCfg?.label || t.priority}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-[var(--ink-2)]">
                        {formatDistanceToNow(new Date(t.created_at), { locale: es, addSuffix: false })}
                      </td>
                      <td className="p-3">
                        <Link
                          href={`/lider/tickets?assign=${t.id}`}
                          className="bg-[var(--lima-500)] hover:bg-[var(--lima-400)] text-[var(--lima-ink)] text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >
                          Asignar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[var(--faint)] text-center py-8">No hay tickets sin asignar</p>
        )}
      </div>
    </div>
  );
}
