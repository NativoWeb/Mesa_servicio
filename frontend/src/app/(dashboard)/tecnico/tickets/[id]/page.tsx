'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useTicket, useUpdateTicket } from '@/hooks/use-tickets';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TecnicoTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const ticketId = Number(id);
  const { data: ticket, isLoading } = useTicket(ticketId);
  const updateTicket = useUpdateTicket();

  const [selectedStatus, setSelectedStatus] = useState('');
  const [comment, setComment] = useState('');
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeNotes, setCloseNotes] = useState('');
  const [confirmRestore, setConfirmRestore] = useState(false);

  if (isLoading || !ticket) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const sCfg = STATUS_CONFIG[ticket.status as keyof typeof STATUS_CONFIG];
  const pCfg = PRIORITY_CONFIG[ticket.priority as keyof typeof PRIORITY_CONFIG];

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === ticket.status) return;
    try {
      await updateTicket.mutateAsync({
        id: ticketId,
        status: selectedStatus as 'open' | 'in_progress' | 'pending' | 'closed',
        ...(selectedStatus === 'closed' ? { closed_at: new Date().toISOString() } : {}),
      });
      toast.success('Estado actualizado');
    } catch {
      toast.error('Error al actualizar estado');
    }
  };

  const handleClose = async () => {
    if (!closeNotes.trim() || !confirmRestore) return;
    try {
      await updateTicket.mutateAsync({
        id: ticketId,
        status: 'closed',
        closed_at: new Date().toISOString(),
      });
      toast.success('Ticket cerrado correctamente');
      setShowCloseModal(false);
    } catch {
      toast.error('Error al cerrar ticket');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-1">
        <Link href="/tecnico" className="hover:text-gray-700">Panel</Link>
        <span className="text-gray-300">/</span>
        <Link href="/tecnico" className="hover:text-gray-700">Mis Tickets</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">#{ticket.id}</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm mb-1">
          <span className="font-mono text-gray-500 font-semibold">TICKET #{ticket.id}</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${sCfg?.color || ''}`}>{sCfg?.label || ticket.status}</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${pCfg?.color || ''}`}>{pCfg?.label || ticket.priority}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>Solicitante: <strong className="text-gray-900">{ticket.requester?.name || 'N/A'}</strong></span>
          <span>Creado: <strong className="text-gray-900">{format(new Date(ticket.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Descripcion del problema</h2>
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{ticket.description}</p>
          </div>

          {/* Status Update */}
          {ticket.status !== 'closed' && (
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Cambiar Estado</h3>
              <div className="flex gap-2">
                <select
                  value={selectedStatus || ticket.status}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-green-500/20"
                >
                  <option value="in_progress">En Progreso</option>
                  <option value="pending">Pendiente</option>
                  <option value="closed">Cerrado</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updateTicket.isPending}
                  className="bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {updateTicket.isPending ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {ticket.status !== 'closed' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCloseModal(true)}
                className="border rounded-xl p-4 text-left transition-colors bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              >
                <p className="text-sm font-semibold">Cerrar Ticket</p>
                <p className="text-[11px] opacity-70 mt-0.5">Finalizar y documentar</p>
              </button>
              <button
                onClick={() => {
                  updateTicket.mutateAsync({ id: ticketId, status: 'escalated' })
                    .then(() => toast.success('Ticket escalado'))
                    .catch(() => toast.error('Error al escalar'));
                }}
                className="border rounded-xl p-4 text-left transition-colors bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
              >
                <p className="text-sm font-semibold">Escalar Ticket</p>
                <p className="text-[11px] opacity-70 mt-0.5">Derivar a nivel superior</p>
              </button>
            </div>
          )}

          {/* Timeline */}
          {ticket.events && ticket.events.length > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Historial de Eventos</h2>
              <div className="space-y-4">
                {ticket.events.map((e, i) => (
                  <div key={e.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mt-1" />
                      {i < ticket.events!.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-gray-900">{e.description}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {e.user?.name} &middot; {format(new Date(e.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          {ticket.comments && ticket.comments.length > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Seguimiento</h2>
              <div className="space-y-4 mb-4">
                {ticket.comments.map((m) => (
                  <div key={m.id} className={`flex ${m.is_internal ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.is_internal ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-900">{m.user?.name || 'N/A'}</span>
                        <span className="text-[10px] text-gray-400">{format(new Date(m.created_at), 'dd/MM HH:mm')}</span>
                      </div>
                      <p className="text-sm text-gray-700">{m.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment input placeholder */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Agregar nota</h2>
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe una respuesta o nota tecnica..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20"
              />
              <button
                onClick={() => toast.info('Endpoint de comentarios proximamente')}
                className="bg-green-700 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Detalles del Ticket</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Sede', value: ticket.campus },
                { label: 'Ubicacion', value: ticket.location || '-' },
                { label: 'Categoria', value: ticket.category || '-' },
                { label: 'Solicitante', value: ticket.requester?.name || 'N/A' },
                { label: 'Email', value: ticket.requester?.email || '-' },
              ].map((d) => (
                <div key={d.label}>
                  <p className="text-[11px] text-gray-400 uppercase">{d.label}</p>
                  <p className="text-gray-700">{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          {ticket.assignee && (
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Tecnico Asignado</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-sm font-bold">
                  {ticket.assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{ticket.assignee.name}</p>
                  <p className="text-xs text-gray-500">{ticket.assignee.campus}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close Ticket Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Confirmar cierre del ticket</h3>
                <button onClick={() => setShowCloseModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Estas a punto de cerrar el ticket <strong>#{ticket.id}</strong>. Describe los pasos realizados.
              </p>
              <textarea
                value={closeNotes}
                onChange={(e) => setCloseNotes(e.target.value)}
                placeholder="Describe los pasos realizados para resolver el problema..."
                rows={4}
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500/20 resize-none mb-4"
              />
              <label className="flex items-start gap-2 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmRestore}
                  onChange={(e) => setConfirmRestore(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Confirmo que el servicio ha sido restablecido y el usuario fue notificado</span>
              </label>
              <div className="flex gap-3">
                <button onClick={() => setShowCloseModal(false)} className="flex-1 px-4 py-2.5 border rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancelar
                </button>
                <button
                  onClick={handleClose}
                  disabled={!confirmRestore || !closeNotes.trim() || updateTicket.isPending}
                  className="flex-1 px-4 py-3 bg-green-800 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  {updateTicket.isPending ? 'Cerrando...' : 'Finalizar Ticket'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
