'use client';

import Link from 'next/link';
import { useTickets } from '@/hooks/use-tickets';
import { useAuthStore } from '@/stores/auth-store';
import { ASSET_STATUS_CONFIG } from '@/lib/constants';

export default function TecnicoEquiposPage() {
  const user = useAuthStore(s => s.user);
  const { data, isLoading } = useTickets({
    assigned_to: user?.id ?? 0,
    per_page: 50,
  });

  // Extract unique assets from tickets (ticket doesn't have asset relation yet,
  // but we show the info available)
  const tickets = data?.data.filter(t => t.status !== 'closed') || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Equipos relacionados a mis tickets</h1>
      <p className="text-gray-500 mb-6">Tickets activos que mencionan equipos o activos. Solo lectura.</p>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="text-left p-3 pl-6 font-medium text-gray-500 text-xs uppercase">Ticket</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Asunto</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Categoria</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Sede</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Ubicacion</th>
              <th className="text-left p-3 pr-6 font-medium text-gray-500 text-xs uppercase">Estado</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={6} className="p-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : !tickets.length ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">No hay tickets activos con equipos vinculados</td></tr>
            ) : (
              tickets.map(t => (
                <tr key={t.id} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 pl-6">
                    <Link href={`/tecnico/tickets/${t.id}`} className="font-mono font-medium text-green-700 hover:underline">#{t.id}</Link>
                  </td>
                  <td className="p-3 text-gray-900 font-medium max-w-[200px] truncate">{t.title}</td>
                  <td className="p-3 text-gray-600">{t.category || '-'}</td>
                  <td className="p-3 text-gray-600">{t.campus}</td>
                  <td className="p-3 text-gray-600">{t.location || '-'}</td>
                  <td className="p-3 pr-6">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      t.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                      t.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {t.status === 'open' ? 'Abierto' : t.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
