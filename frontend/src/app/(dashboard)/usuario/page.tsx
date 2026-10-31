'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClipboardList, Clock, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';

interface DashboardTicket {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
}

const statusLabelMap: Record<string, string> = {
  open: 'Abierto',
  in_progress: 'En Progreso',
  pending: 'Pendiente',
  closed: 'Cerrado',
};

const statusStyles: Record<string, string> = {
  open: 'bg-[var(--med-bg)] text-[var(--med)]',
  in_progress: 'bg-[var(--info-bg)] text-[var(--info)]',
  pending: 'bg-[var(--high-bg)] text-[var(--high)]',
  closed: 'bg-[var(--low-bg)] text-[var(--selva-500)]',
};

export default function UsuarioDashboardPage() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(' ')[0] || 'Usuario';

  const [recentTickets, setRecentTickets] = useState<DashboardTicket[]>([]);
  const [kpis, setKpis] = useState({ open: 0, in_progress: 0, closed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/tickets', { params: { per_page: 5 } });
        const allTickets: DashboardTicket[] = res.data.data || [];
        setRecentTickets(allTickets);

        // Calculate KPIs from the full total - fetch all statuses counts
        const openCount = allTickets.filter((t) => t.status === 'open').length;
        const inProgressCount = allTickets.filter((t) => t.status === 'in_progress').length;
        const closedCount = allTickets.filter((t) => t.status === 'closed').length;

        // Try to get a broader count for KPIs
        try {
          const allRes = await api.get('/tickets', { params: { per_page: 100 } });
          const all: DashboardTicket[] = allRes.data.data || [];
          setKpis({
            open: all.filter((t) => t.status === 'open' || t.status === 'pending').length,
            in_progress: all.filter((t) => t.status === 'in_progress').length,
            closed: all.filter((t) => t.status === 'closed').length,
          });
        } catch {
          setKpis({ open: openCount, in_progress: inProgressCount, closed: closedCount });
        }
      } catch {
        setRecentTickets([]);
        setKpis({ open: 0, in_progress: 0, closed: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">Buenos dias, {firstName}</h1>
        <p className="text-[var(--muted)] text-sm">Aqui puedes crear y hacer seguimiento a tus solicitudes de soporte tecnico institucional.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Tickets Abiertos', value: String(kpis.open).padStart(2, '0'), icon: ClipboardList, bg: 'bg-[var(--info-bg)]', color: 'text-[var(--info)]', iconColor: 'text-[var(--info)]' },
          { label: 'En Progreso', value: String(kpis.in_progress).padStart(2, '0'), icon: Clock, bg: 'bg-[var(--med-bg)]', color: 'text-[var(--med)]', iconColor: 'text-[var(--med)]' },
          { label: 'Cerrados', value: String(kpis.closed).padStart(2, '0'), icon: CheckCircle, bg: 'bg-[var(--low-bg)]', color: 'text-[var(--selva-500)]', iconColor: 'text-[var(--selva-500)]' },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--surface)] rounded-xl border border-[var(--line)] p-6 hover:shadow-[var(--sh-1)] transition-shadow">
            <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <p className={`text-3xl font-bold ${s.color}`}>{loading ? '--' : s.value}</p>
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--line)]">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="font-semibold text-[var(--ink)]">Mis Tickets Recientes</h2>
          <Link href="/usuario/tickets" className="text-sm text-[var(--selva-500)] hover:underline font-medium">
            Ver todos mis tickets →
          </Link>
        </div>
        <div className="p-6 pt-4">
          {loading ? (
            <div className="text-center py-8">
              <svg className="animate-spin h-6 w-6 mx-auto text-[var(--selva-500)]" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            </div>
          ) : recentTickets.length === 0 ? (
            <div className="text-center py-8 text-[var(--faint)]">
              <p>No tienes tickets aun.</p>
              <Link href="/usuario/tickets/nuevo" className="text-[var(--selva-500)] hover:underline text-sm font-medium mt-1 inline-block">Crear tu primer ticket</Link>
            </div>
          ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold text-[var(--muted)] text-xs uppercase">ID Ticket</th>
                <th className="text-left py-3 font-semibold text-[var(--muted)] text-xs uppercase">Categoria</th>
                <th className="text-left py-3 font-semibold text-[var(--muted)] text-xs uppercase">Estado</th>
                <th className="text-right py-3 font-semibold text-[var(--muted)] text-xs uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((t) => (
                <tr key={t.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--surface-2)] transition-colors cursor-pointer">
                  <td className="py-3.5">
                    <span className="font-mono font-semibold text-[var(--selva-500)]">#{t.ticket_number || `T-${String(t.id).padStart(4, '0')}`}</span>
                  </td>
                  <td className="py-3.5">
                    <p className="font-medium text-[var(--ink)]">{t.title}</p>
                    <p className="text-xs text-[var(--muted)]">{t.category || t.description?.substring(0, 40)}</p>
                  </td>
                  <td className="py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[t.status] || 'bg-[var(--surface-3)] text-[var(--ink-2)]'}`}>
                      {statusLabelMap[t.status] || t.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right text-[var(--muted)]">{new Date(t.created_at).toLocaleDateString('es-CO')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* FAB */}
      <Link
        href="/usuario/tickets/nuevo"
        className="fixed bottom-8 right-8 w-14 h-14 bg-[var(--lima-500)] hover:bg-[var(--lima-400)] text-[var(--lima-ink)] rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors hover:scale-105"
      >
        +
      </Link>
    </div>
  );
}
