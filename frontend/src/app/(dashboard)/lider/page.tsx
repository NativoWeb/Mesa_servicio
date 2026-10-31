'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '@/hooks/use-dashboard';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ticket, AlertTriangle, CheckCircle, TrendingUp, Clock } from 'lucide-react';

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
        <div className="hero-strip animate-pulse" style={{ height: 140 }} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[18px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="nw-card p-5 h-32 animate-pulse" />
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
    { label: 'Tickets Abiertos', value: tickets.open, icon: Ticket, bg: 'bg-[var(--info-bg)]', iconColor: 'text-[var(--info)]', valueColor: 'text-[var(--info)]' },
    { label: 'En Progreso', value: tickets.in_progress, icon: Clock, bg: 'bg-[var(--med-bg)]', iconColor: 'text-[var(--med)]', valueColor: 'text-[var(--med)]' },
    { label: 'Resueltos', value: tickets.closed, icon: CheckCircle, bg: 'bg-[var(--low-bg)]', iconColor: 'text-[var(--selva-500)]', valueColor: 'text-[var(--selva-500)]' },
    { label: 'Tasa Resolución', value: `${slaRate}%`, icon: TrendingUp, bg: 'bg-[var(--low-bg)]', iconColor: 'text-[var(--selva-500)]', valueColor: 'text-[var(--selva-500)]' },
    { label: 'Críticos/Altos', value: criticalOpen, icon: AlertTriangle, bg: 'bg-[var(--crit-bg)]', iconColor: 'text-[var(--crit)]', valueColor: 'text-[var(--crit)]' },
  ];

  const maxCapacity = 20;

  return (
    <div className="space-y-6 view-anim">
      {/* Hero Strip */}
      <div className="hero-strip">
        <div className="flex items-center justify-between flex-wrap gap-5">
          <div>
            <h1 className="text-[clamp(24px,2.6vw,32px)] font-[800] tracking-[-0.035em] text-white">
              Panel de Control
            </h1>
            <p className="text-[#b5cdbe] mt-1.5 max-w-[62ch] text-[15.5px]">
              Mesa de Servicio TI &middot; Unidades Tecnológicas de Santander
            </p>
          </div>
        </div>
        <div className="flex gap-2.5 flex-wrap mt-[18px]">
          <div className="focus-chip">
            <b>{tickets.open}</b> Abiertos
          </div>
          <div className="focus-chip hot">
            <b>{criticalOpen}</b> Críticos/Altos
          </div>
          <div className="focus-chip">
            <b>{slaRate}%</b> Resolución
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[18px]">
        {kpis.map((stat) => (
          <div key={stat.label} className="nw-card kpi">
            <div className="flex items-center justify-between">
              <div className={`kpi-ico ${stat.bg} ${stat.iconColor}`}>
                <stat.icon className="w-[18px] h-[18px]" />
              </div>
            </div>
            <p className={`kpi-value ${stat.valueColor}`}>{stat.value}</p>
            <p className="kpi-label">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
        {/* Priority Donut */}
        <div className="nw-card card-pad">
          <h2 className="font-[720] text-[16px] text-[var(--ink)] mb-4">Tickets por prioridad</h2>
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
        <div className="nw-card card-pad">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[720] text-[16px] text-[var(--ink)]">Tickets (Últimos 7 días)</h2>
            <span className="nw-badge">Semana Actual</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
        {/* Technician Workload */}
        <div className="nw-card card-pad">
          <h2 className="font-[720] text-[16px] text-[var(--ink)] mb-4">Carga Operativa por Técnico</h2>
          {technician_workload && technician_workload.length > 0 ? (
            <div className="space-y-3">
              {technician_workload.map((tech) => {
                const pct = Math.min(Math.round((tech.open_tickets / maxCapacity) * 100), 100);
                const fillClass = pct > 80 ? 'load-fill hi' : pct > 50 ? 'load-fill mid' : 'load-fill';
                return (
                  <div key={tech.id} className="flex items-center gap-3">
                    <div className="nw-avatar sm" style={{ background: 'var(--low-bg)', color: 'var(--selva-500)' }}>
                      {tech.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[var(--ink)] truncate">{tech.name}</span>
                        <span className="text-xs text-[var(--muted)]">{tech.open_tickets} Tickets</span>
                      </div>
                      <div className="load-track">
                        <div className={fillClass} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className={`text-xs font-[700] px-2 py-0.5 rounded-full ${pct > 80 ? 'bg-[var(--crit-bg)] text-[var(--crit)]' : pct > 50 ? 'bg-[var(--med-bg)] text-[var(--med)]' : 'bg-[var(--low-bg)] text-[var(--selva-500)]'}`}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[var(--faint)] text-center py-8">No hay técnicos registrados</p>
          )}
        </div>

        {/* General Stats */}
        <div className="nw-card card-pad">
          <h2 className="font-[720] text-[16px] text-[var(--ink)] mb-4">Resumen General</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--info-bg)] rounded-[var(--r-sm)] p-4">
              <p className="text-xs text-[var(--info)] uppercase font-[550]">Total Activos</p>
              <p className="text-2xl font-bold text-[var(--info)]">{data.assets.total}</p>
            </div>
            <div className="bg-[var(--low-bg)] rounded-[var(--r-sm)] p-4">
              <p className="text-xs text-[var(--selva-500)] uppercase font-[550]">Activos Operativos</p>
              <p className="text-2xl font-bold text-[var(--selva-500)]">{data.assets.operational}</p>
            </div>
            <div className="bg-[var(--med-bg)] rounded-[var(--r-sm)] p-4">
              <p className="text-xs text-[var(--med)] uppercase font-[550]">Mantenimientos Mes</p>
              <p className="text-2xl font-bold text-[var(--med)]">{data.maintenances.pending_this_month}</p>
            </div>
            <div className="bg-[var(--violet-bg)] rounded-[var(--r-sm)] p-4">
              <p className="text-xs text-[var(--violet)] uppercase font-[550]">Usuarios</p>
              <p className="text-2xl font-bold text-[var(--violet)]">{data.users.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unassigned Queue */}
      <div className="nw-card">
        <div className="card-head">
          <div>
            <h3>Cola de Espera: Tickets sin asignar</h3>
            <p className="text-[13px] text-[var(--muted)] mt-0.5">Priorización por tiempo de espera</p>
          </div>
          {unassigned_tickets && unassigned_tickets.length > 0 && (
            <span className="nw-badge" style={{ background: 'var(--crit-bg)', color: 'var(--crit)' }}>
              {unassigned_tickets.length} sin asignar
            </span>
          )}
        </div>
        <div className="card-body p-0">
          {unassigned_tickets && unassigned_tickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="nw-table">
                <thead>
                  <tr>
                    <th>ID Ticket</th>
                    <th>Solicitante / Sede</th>
                    <th>Asunto</th>
                    <th>Prioridad</th>
                    <th>Esperando</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {unassigned_tickets.map((t) => {
                    const priorityCfg = PRIORITY_CONFIG[t.priority as keyof typeof PRIORITY_CONFIG];
                    return (
                      <tr key={t.id}>
                        <td className="font-mono font-medium text-[var(--ink)]">#{t.id}</td>
                        <td>
                          <p className="font-medium text-[var(--ink)]">{t.requester?.name || 'N/A'}</p>
                          <p className="text-xs text-[var(--muted)]">{t.campus}</p>
                        </td>
                        <td className="text-[var(--ink-2)] max-w-xs truncate">{t.title}</td>
                        <td>
                          <span className={`nw-badge ${priorityCfg?.color || ''}`}>
                            {priorityCfg?.label || t.priority}
                          </span>
                        </td>
                        <td className="text-[var(--ink-2)]">
                          {formatDistanceToNow(new Date(t.created_at), { locale: es, addSuffix: false })}
                        </td>
                        <td>
                          <Link
                            href={`/lider/tickets?assign=${t.id}`}
                            className="nw-btn primary sm"
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
    </div>
  );
}
