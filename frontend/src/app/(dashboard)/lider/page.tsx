'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const priorityData = [
  { name: 'Alta / Crítica', value: 120, color: '#D32F2F' },
  { name: 'Media', value: 163, color: '#F9A825' },
  { name: 'Baja', value: 182, color: '#388E3C' },
];

const weeklyData = [
  { day: 'Lun', resueltos: 38, creados: 42 },
  { day: 'Mar', resueltos: 45, creados: 38 },
  { day: 'Mié', resueltos: 52, creados: 48 },
  { day: 'Jue', resueltos: 41, creados: 35 },
  { day: 'Vie', resueltos: 58, creados: 50 },
  { day: 'Sáb', resueltos: 20, creados: 12 },
  { day: 'Dom', resueltos: 8, creados: 5 },
];

const technicians = [
  { name: 'Andrés Mendoza', tickets: 15, capacity: 40, specialty: 'Redes' },
  { name: 'Lucía Vargas', tickets: 8, capacity: 40, specialty: 'Software' },
  { name: 'Carlos Ruiz', tickets: 4, capacity: 40, specialty: 'Hardware' },
  { name: 'Diana Soler', tickets: 12, capacity: 40, specialty: 'Infraestructura' },
];

const slaAlerts = [
  { id: 'T-0028', title: 'Caída de Red Edificio A', time: '2h restantes', type: 'critical' as const },
  { id: 'T-0031', title: 'Mantenimiento Preventivo: Servidor Central', time: 'Programado hoy 15:00', type: 'warning' as const },
  { id: 'T-0035', title: 'Actualización de Licencias Microsoft', time: 'Vence en 3 días', type: 'info' as const },
];

const unassignedTickets = [
  { id: '#5012', user: 'Diana Pineda', subject: 'Falla en acceso a sistema académico', priority: 'Alta' as const, time: '42 min', campus: 'Bucaramanga' },
  { id: '#5011', user: 'Óscar Ruiz', subject: 'Video Beam no proyecta imagen', priority: 'Media' as const, time: '3h', campus: 'Piedecuesta' },
  { id: '#5010', user: 'Marta Gómez', subject: 'Configuración de correo institucional', priority: 'Baja' as const, time: '15 min', campus: 'Bucaramanga' },
];

const priorityColors = { Alta: 'bg-red-100 text-red-700', Media: 'bg-yellow-100 text-yellow-700', Baja: 'bg-green-100 text-green-700' };

export default function LiderDashboardPage() {
  const total = priorityData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Control — Mesa de Servicio TI</h1>
        <p className="text-gray-500 text-sm">Sede: Bucaramanga &middot; Semana Actual</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Tickets Abiertos', value: '128', icon: '📋', color: 'text-blue-700', bg: 'bg-blue-50', trend: '+12%' },
          { label: 'En Progreso', value: '42', icon: '⏳', color: 'text-yellow-700', bg: 'bg-yellow-50', trend: null },
          { label: 'Resueltos', value: '315', icon: '✅', color: 'text-green-700', bg: 'bg-green-50', trend: '+8%' },
          { label: 'Tasa SLA', value: '94%', icon: '📊', color: 'text-green-800', bg: 'bg-green-50', trend: '-2%' },
          { label: 'Críticos sin Resolver', value: '08', icon: '🔴', color: 'text-red-700', bg: 'bg-red-50', trend: null },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center text-sm`}>
                {stat.icon}
              </div>
              {stat.trend && (
                <span className={`text-[11px] font-medium ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
              )}
            </div>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Donut */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Tickets por prioridad</h2>
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
                  <p className="text-2xl font-bold text-gray-900">{total}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Total</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {priorityData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-sm text-gray-700">{d.name}</span>
                  <span className="text-sm font-semibold text-gray-900 ml-auto">{Math.round((d.value / total) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-6 mt-4 pt-4 border-t text-sm text-gray-500">
            <div><span className="font-semibold text-gray-900">34.2</span> tickets media diaria</div>
            <div><span className="font-semibold text-gray-900">56</span> pico máximo</div>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Tickets resueltos (Últimos 7 días)</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Semana Actual</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Bar dataKey="creados" fill="#E8E5E0" radius={[4, 4, 0, 0]} name="Creados" />
              <Bar dataKey="resueltos" fill="#CDDC39" radius={[4, 4, 0, 0]} name="Resueltos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technician Workload + SLA Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technician Workload */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Carga Operativa por Técnico</h2>
            <button className="text-xs text-green-700 hover:underline font-medium">Ver todos</button>
          </div>
          <div className="space-y-3">
            {technicians.map((tech) => {
              const pct = Math.round((tech.tickets / tech.capacity) * 100);
              const barColor = pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-yellow-500' : 'bg-green-500';
              return (
                <div key={tech.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-xs font-bold shrink-0">
                    {tech.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 truncate">{tech.name}</span>
                      <span className="text-xs text-gray-500">{tech.tickets} Tickets</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${pct > 80 ? 'bg-red-100 text-red-700' : pct > 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SLA Alerts */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Alertas de SLA & Próximos Eventos</h2>
          <div className="space-y-3">
            {slaAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg p-3 border-l-4 ${
                  alert.type === 'critical' ? 'bg-red-50 border-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-mono text-xs text-gray-500 mr-1">TICKET {alert.id}</span>
                      {alert.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unassigned Queue */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Cola de Espera: Tickets sin asignar</h2>
            <p className="text-xs text-gray-500">Priorización por tiempo de espera</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">3 urgentes</span>
            <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg font-medium transition-colors">
              Asignar Automáticamente
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">ID Ticket</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Nombre / Sede</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Asunto</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Prioridad</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Esperando</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Acción</th>
              </tr>
            </thead>
            <tbody>
              {unassignedTickets.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 font-mono font-medium text-gray-900">{t.id}</td>
                  <td className="p-3">
                    <p className="font-medium text-gray-900">{t.user}</p>
                    <p className="text-xs text-gray-500">{t.campus}</p>
                  </td>
                  <td className="p-3 text-gray-700 max-w-xs truncate">{t.subject}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[t.priority]}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-sm font-medium ${t.priority === 'Alta' ? 'text-red-600' : 'text-gray-600'}`}>
                      {t.time}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="bg-green-700 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors">
                      Asignar ahora
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
