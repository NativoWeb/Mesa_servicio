'use client';

import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '@/hooks/use-dashboard';

const quickActions = [
  { label: 'Usuarios y Roles', href: '/admin/usuarios' },
  { label: 'Parametros SLA', href: '/admin/sla' },
  { label: 'Logs de Auditoria', href: '/admin/logs' },
  { label: 'Reportes', href: '/admin/reportes' },
  { label: 'Roles y Permisos', href: '/admin/roles' },
  { label: 'Configuracion', href: '/admin/configuracion' },
];

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-[var(--line)] rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="bg-[var(--surface)] rounded-xl border p-4 h-20 animate-pulse" />)}
        </div>
      </div>
    );
  }

  const { tickets, assets, maintenances, users, tickets_weekly } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">Panel de Administracion del Sistema</h1>
        <p className="text-[var(--muted)] text-sm">Gestion centralizada de la Mesa de Servicio TI.</p>
      </div>

      {/* System KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Usuarios', value: users.total, color: 'text-[var(--ink)]' },
          { label: 'Total Tickets', value: tickets.total, color: 'text-[var(--info)]' },
          { label: 'Tickets Abiertos', value: tickets.open, color: 'text-[var(--med)]' },
          { label: 'Total Activos', value: assets.total, color: 'text-[var(--selva-500)]' },
          { label: 'Mantenimientos Mes', value: maintenances.pending_this_month, color: 'text-[var(--violet)]' },
        ].map((s) => (
          <div key={s.label} className="nw-card card-pad hover:shadow-[var(--sh-1)] transition-shadow">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="nw-card card-pad">
          <h2 className="font-semibold text-[var(--ink)] mb-4">Tickets: Creados vs. Resueltos (7 dias)</h2>
          {tickets_weekly && tickets_weekly.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={tickets_weekly} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Bar dataKey="creados" fill="#D4D4D4" radius={[4, 4, 0, 0]} name="Creados" />
                <Bar dataKey="resueltos" fill="#CDDC39" radius={[4, 4, 0, 0]} name="Resueltos" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[var(--faint)] text-center py-8">Sin datos semanales</p>
          )}
        </div>

        <div className="nw-card card-pad">
          <h2 className="font-semibold text-[var(--ink)] mb-4">Estado de Tickets</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Abiertos', value: tickets.open, color: 'bg-[var(--med-bg)] text-[var(--med)]' },
              { label: 'En Progreso', value: tickets.in_progress, color: 'bg-[var(--info-bg)] text-[var(--info)]' },
              { label: 'Pendientes', value: tickets.pending, color: 'bg-[var(--high-bg)] text-[var(--high)]' },
              { label: 'Escalados', value: tickets.escalated, color: 'bg-[var(--crit-bg)] text-[var(--crit)]' },
              { label: 'Cerrados', value: tickets.closed, color: 'bg-[var(--low-bg)] text-[var(--selva-500)]' },
              { label: 'Cerrados Hoy', value: tickets.closed_today, color: 'bg-[var(--low-bg)] text-[var(--selva-500)]' },
            ].map(s => (
              <div key={s.label} className={`rounded-lg p-3 ${s.color}`}>
                <p className="text-xs uppercase opacity-70">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assets Summary */}
      <div className="nw-card card-pad">
        <h2 className="font-semibold text-[var(--ink)] mb-4">Estado de Activos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: assets.total, color: 'bg-[var(--canvas)]' },
            { label: 'Operativos', value: assets.operational, color: 'bg-[var(--low-bg)]' },
            { label: 'Averiados', value: assets.damaged, color: 'bg-[var(--crit-bg)]' },
            { label: 'Dados de Baja', value: assets.decommissioned, color: 'bg-[var(--surface-3)]' },
          ].map(s => (
            <div key={s.label} className={`rounded-lg p-4 ${s.color}`}>
              <p className="text-xs text-[var(--ink-2)] uppercase">{s.label}</p>
              <p className="text-2xl font-bold text-[var(--ink)]">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-semibold text-[var(--ink)] mb-4">Acciones Rapidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((a) => (
            <Link key={a.label} href={a.href} className="nw-card card-pad text-center hover:shadow-[var(--sh-1)] hover:border-[var(--lima-500)] transition-all group">
              <p className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--selva-500)]">{a.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
