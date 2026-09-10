'use client';

import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const ticketData = [
  { week: 'Sep 01', creados: 45, resueltos: 38 },
  { week: 'Sep 08', creados: 52, resueltos: 48 },
  { week: 'Sep 15', creados: 38, resueltos: 42 },
  { week: 'Sep 22', creados: 60, resueltos: 55 },
  { week: 'Sep 29', creados: 48, resueltos: 50 },
];

const usersData = [
  { day: 'Lunes', activos: 320 },
  { day: 'Martes', activos: 380 },
  { day: 'Miércoles', activos: 410 },
  { day: 'Jueves', activos: 390 },
  { day: 'Viernes', activos: 350 },
  { day: 'Sábado', activos: 120 },
  { day: 'Domingo', activos: 80 },
];

const alerts = [
  { title: 'Errores LDAP', desc: '12 reintentos fallidos en servidor de directorio activo Sede CC.', type: 'error' as const },
  { title: 'Fallo Backup', desc: 'La tarea programada Diaria_Incremental no se completó.', type: 'error' as const },
  { title: 'SLA Incumplido', desc: '3 Tickets de categoría Servidores superaron el tiempo límite.', type: 'warning' as const },
];

const quickActions = [
  { label: 'Usuarios y Roles', icon: '👥', href: '/admin/usuarios' },
  { label: 'Configuración LDAP', icon: '🔗', href: '/admin/configuracion?tab=ldap' },
  { label: 'Parámetros SLA', icon: '⏱️', href: '/admin/sla' },
  { label: 'Logs de Auditoría', icon: '📜', href: '/admin/logs' },
  { label: 'Backup', icon: '💾', href: '/admin/configuracion?tab=backup' },
  { label: 'Plantillas Notif.', icon: '📝', href: '/admin/configuracion?tab=templates' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración del Sistema</h1>
        <p className="text-gray-500 text-sm">Gestión centralizada de infraestructura, usuarios y parámetros críticos de la Mesa de Servicio TI de las Unidades Tecnológicas de Santander.</p>
      </div>

      {/* System KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Estado Servidor', value: 'Operativo', icon: '🟢', color: 'text-green-700' },
          { label: 'Usuarios Activos', value: '1,248', icon: '👤', color: 'text-gray-900' },
          { label: 'Uptime', value: '99.8%', icon: '📈', color: 'text-green-700' },
          { label: 'Sinc. LDAP', value: 'hace 5 min', icon: '🔄', color: 'text-gray-900', sub: '⏰' },
          { label: 'Último Backup', value: 'hoy 2:00 AM', icon: '💾', color: 'text-gray-900', sub: '✅' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className={`text-lg font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Tickets: Creados vs. Resueltos</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gray-300" /> Creados</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-500" /> Resueltos</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ticketData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Bar dataKey="creados" fill="#D4D4D4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resueltos" fill="#CDDC39" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Usuarios Activos</h2>
          <p className="text-xs text-gray-500 mb-2">Tendencia de uso por día</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={usersData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Line type="monotone" dataKey="activos" stroke="#1B5E20" strokeWidth={2} dot={{ fill: '#1B5E20', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-red-500">⚠️</span> Alertas Críticas del Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map((a, i) => (
            <div key={i} className={`rounded-xl p-4 ${a.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <h3 className={`text-sm font-semibold ${a.type === 'error' ? 'text-red-800' : 'text-yellow-800'}`}>{a.title}</h3>
              <p className={`text-xs mt-1 ${a.type === 'error' ? 'text-red-600' : 'text-yellow-700'}`}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4">Acciones de Configuración Rápida</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((a) => (
            <Link key={a.label} href={a.href} className="bg-white rounded-xl border p-4 text-center hover:shadow-sm hover:border-green-200 transition-all group">
              <span className="text-2xl">{a.icon}</span>
              <p className="text-sm font-medium text-gray-900 mt-2 group-hover:text-green-800">{a.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
