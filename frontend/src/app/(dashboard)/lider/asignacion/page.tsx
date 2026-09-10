'use client';

import { useState } from 'react';
import { useTickets, useUpdateTicket } from '@/hooks/use-tickets';
import { useUsers } from '@/hooks/use-users';
import { PRIORITY_CONFIG } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

export default function AsignacionPage() {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  const { data: ticketsData, isLoading: loadingTickets } = useTickets({
    status: 'open',
    per_page: 50,
  });

  const { data: techsData, isLoading: loadingTechs } = useUsers({ role: 'technician', per_page: 50 });

  const updateTicket = useUpdateTicket();

  const unassigned = ticketsData?.data.filter(t => !t.assigned_to) || [];

  const handleAssign = async (ticketId: number, techId: number) => {
    try {
      await updateTicket.mutateAsync({ id: ticketId, assigned_to: techId, status: 'in_progress' });
      toast.success('Ticket asignado correctamente');
      setSelectedTicket(null);
    } catch {
      toast.error('Error al asignar el ticket');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Asignacion de Tickets</h1>
      <p className="text-gray-500 mb-6">Asigna tickets a tecnicos disponibles</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets sin asignar */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Tickets pendientes de asignacion ({unassigned.length})</h2>
          {loadingTickets ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
          ) : unassigned.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No hay tickets sin asignar</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {unassigned.map(t => {
                const pCfg = PRIORITY_CONFIG[t.priority as keyof typeof PRIORITY_CONFIG];
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedTicket === t.id ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-gray-500">#{t.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pCfg?.color || ''}`}>{pCfg?.label || t.priority}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-1 truncate">{t.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{t.requester?.name}</span>
                      <span>&middot;</span>
                      <span>{t.campus}</span>
                      <span>&middot;</span>
                      <span>{formatDistanceToNow(new Date(t.created_at), { locale: es, addSuffix: true })}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tecnicos */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Tecnicos disponibles</h2>
          {loadingTechs ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
          ) : !techsData?.data.length ? (
            <p className="text-gray-400 text-center py-8">No hay tecnicos registrados</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {techsData.data.map(tech => (
                <div key={tech.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-xs font-bold">
                      {tech.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tech.name}</p>
                      <p className="text-xs text-gray-500">{tech.campus || 'Sin sede'}</p>
                    </div>
                  </div>
                  <button
                    disabled={!selectedTicket || updateTicket.isPending}
                    onClick={() => selectedTicket && handleAssign(selectedTicket, tech.id)}
                    className="bg-green-700 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    {updateTicket.isPending ? 'Asignando...' : 'Asignar'}
                  </button>
                </div>
              ))}
            </div>
          )}
          {!selectedTicket && techsData?.data.length ? (
            <p className="text-xs text-gray-400 mt-3 text-center">Selecciona un ticket a la izquierda primero</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
