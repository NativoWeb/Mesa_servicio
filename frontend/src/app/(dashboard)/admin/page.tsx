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
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="bg-white rounded-xl border p-4 h-20 animate-pulse" />)}
        </div>
      </div>
    );
  }

  const { tickets, assets, maintenances, users, tickets_weekly } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administracion del Sistema</h1>
        <p className="text-gray-500 text-sm">Gestion centralizada de la Mesa de Servicio TI.</p>
      </div>

      {/* System KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Usuarios', value: users.total, color: 'text-gray-900' },
          { label: 'Total Tickets', value: tickets.total, color: 'text-blue-700' },
          { label: 'Tickets Abiertos', value: tickets.open, color: 'text-yellow-700' },
          { label: 'Total Activos', value: assets.total, color: 'text-green-700' },
          { label: 'Mantenimientos Mes', value: maintenances.pending_this_month, color: 'text-purple-700' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Tickets: Creados vs. Resueltos (7 dias)</h2>
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
            <p className="text-gray-400 text-center py-8">Sin datos semanales</p>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Estado de Tickets</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Abiertos', value: tickets.open, color: 'bg-yellow-50 text-yellow-800' },
              { label: 'En Progreso', value: tickets.in_progress, color: 'bg-blue-50 text-blue-800' },
              { label: 'Pendientes', value: tickets.pending, color: 'bg-orange-50 text-orange-800' },
              { label: 'Escalados', value: tickets.escalated, color: 'bg-red-50 text-red-800' },
              { label: 'Cerrados', value: tickets.closed, color: 'bg-green-50 text-green-800' },
              { label: 'Cerrados Hoy', value: tickets.closed_today, color: 'bg-green-50 text-green-800' },
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
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Estado de Activos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: assets.total, color: 'bg-gray-50' },
            { label: 'Operativos', value: assets.operational, color: 'bg-green-50' },
            { label: 'Averiados', value: assets.damaged, color: 'bg-red-50' },
            { label: 'Dados de Baja', value: assets.decommissioned, color: 'bg-gray-100' },
          ].map(s => (
            <div key={s.label} className={`rounded-lg p-4 ${s.color}`}>
              <p className="text-xs text-gray-600 uppercase">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4">Acciones Rapidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((a) => (
            <Link key={a.label} href={a.href} className="bg-white rounded-xl border p-4 text-center hover:shadow-sm hover:border-green-200 transition-all group">
              <p className="text-sm font-medium text-gray-900 group-hover:text-green-800">{a.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
