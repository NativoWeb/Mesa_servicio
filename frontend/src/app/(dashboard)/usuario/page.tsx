'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';

const recentTickets = [
  { id: '#T-0042', title: 'Problema con Correo', desc: 'Acceso a Outlook Institucional', status: 'open', statusLabel: 'Abierto', date: '12 Oct 2023' },
  { id: '#T-0039', title: 'Soporte WiFi', desc: 'Conexión inestable Edificio A', status: 'in_progress', statusLabel: 'En Progreso', date: '10 Oct 2023' },
  { id: '#T-0035', title: 'Reset de Contraseña', desc: 'Portal académico', status: 'closed', statusLabel: 'Cerrado', date: '05 Oct 2023' },
  { id: '#T-0031', title: 'Instalación Software', desc: 'AutoCAD para Lab TI', status: 'pending', statusLabel: 'Pendiente', date: '02 Oct 2023' },
  { id: '#T-0028', title: 'Préstamo de Portátil', desc: 'Solicitud temporal', status: 'closed', statusLabel: 'Cerrado', date: '28 Sep 2023' },
];

const statusStyles: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  pending: 'bg-orange-100 text-orange-800',
  closed: 'bg-green-100 text-green-800',
};

export default function UsuarioDashboardPage() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(' ')[0] || 'Usuario';

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Buenos días, {firstName}</h1>
        <p className="text-gray-500 text-sm">Aquí puedes crear y hacer seguimiento a tus solicitudes de soporte técnico institucional.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Tickets Abiertos', value: '12', icon: '📋', bg: 'bg-blue-50', color: 'text-blue-700' },
          { label: 'En Progreso', value: '04', icon: '⏳', bg: 'bg-yellow-50', color: 'text-yellow-700' },
          { label: 'Cerrados este Mes', value: '28', icon: '✅', bg: 'bg-green-50', color: 'text-green-700' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-6 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center text-lg mb-3`}>
              {s.icon}
            </div>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-xl border">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="font-semibold text-gray-900">Mis Tickets Recientes</h2>
          <Link href="/usuario/tickets" className="text-sm text-green-700 hover:underline font-medium">
            Ver todos mis tickets →
          </Link>
        </div>
        <div className="p-6 pt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium text-gray-500 text-xs uppercase">ID Ticket</th>
                <th className="text-left py-3 font-medium text-gray-500 text-xs uppercase">Categoría</th>
                <th className="text-left py-3 font-medium text-gray-500 text-xs uppercase">Estado</th>
                <th className="text-right py-3 font-medium text-gray-500 text-xs uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((t) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <td className="py-3.5">
                    <span className="font-mono font-semibold text-green-800">{t.id}</span>
                  </td>
                  <td className="py-3.5">
                    <p className="font-medium text-gray-900">{t.title}</p>
                    <p className="text-xs text-gray-500">{t.desc}</p>
                  </td>
                  <td className="py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[t.status]}`}>
                      {t.statusLabel}
                    </span>
                  </td>
                  <td className="py-3.5 text-right text-gray-500">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAB */}
      <Link
        href="/usuario/tickets/nuevo"
        className="fixed bottom-8 right-8 w-14 h-14 bg-green-700 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors hover:scale-105"
      >
        +
      </Link>
    </div>
  );
}
