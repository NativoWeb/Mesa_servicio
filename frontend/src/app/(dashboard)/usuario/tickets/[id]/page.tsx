'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { useComments, useCreateComment } from '@/hooks/use-comments';
import { toast as sonnerToast } from 'sonner';

const statusLabelMap: Record<string, string> = {
  open: 'Abierto',
  in_progress: 'En Progreso',
  pending: 'Pendiente',
  closed: 'Cerrado',
};

const priorityLabelMap: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Critica',
};

const statusColorMap: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  pending: 'bg-orange-100 text-orange-800',
  closed: 'bg-green-100 text-green-800',
};

const priorityColorMap: Record<string, string> = {
  low: 'bg-slate-100 text-slate-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

interface TicketDetail {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  campus: string;
  location: string;
  created_at: string;
  requester?: { name: string };
  assigned_user?: { name: string; role?: string } | null;
  comments?: { id: number; body: string; user: { name: string }; created_at: string; is_internal: boolean }[];
  attachments?: { id: number; file_name: string; file_size?: number }[];
  events?: { type: string; description: string; created_at: string }[];
}

// Mock fallback data
const mockTicket: TicketDetail = {
  id: 42,
  ticket_number: 'T-0042',
  title: 'Computador del aula 203 no enciende',
  status: 'in_progress',
  priority: 'high',
  category: 'Hardware - Equipos de Computo',
  campus: 'Sede Central',
  location: 'Lab. Informatica 3 - Aula 203',
  created_at: '2025-04-15T00:00:00Z',
  assigned_user: { name: 'Andres Gomez' },
  description: 'Al intentar encender el equipo del docente en el aula 203, este emite una serie de pitidos cortos y la pantalla permanece en negro.',
  comments: [],
  attachments: [],
  events: [],
};

export default function UsuarioTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [comment, setComment] = useState('');
  const [ticket, setTicket] = useState<TicketDetail>(mockTicket);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const { user } = useAuthStore();

  const ticketId = Number(id);
  const { data: commentsData } = useComments('tickets', ticketId);
  const createComment = useCreateComment('tickets', ticketId);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${id}`);
        const data = res.data.data || res.data;
        setTicket(data);
      } catch {
        // Keep mock data as fallback
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleSendComment = async () => {
    if (!comment.trim()) return;
    try {
      await createComment.mutateAsync({ body: comment, is_internal: false });
      setComment('');
      sonnerToast.success('Comentario enviado');
    } catch {
      sonnerToast.error('Error al enviar comentario');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <svg className="animate-spin h-8 w-8 mx-auto text-green-700 mb-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        <p className="text-sm text-gray-500">Cargando ticket...</p>
      </div>
    );
  }

  const displayId = `#${ticket.ticket_number || `T-${String(ticket.id).padStart(4, '0')}`}`;
  const assigneeName = ticket.assigned_user?.name || 'Sin asignar';
  const dateStr = new Date(ticket.created_at).toLocaleDateString('es-CO');
  const comments = commentsData?.data || ticket.comments || [];
  const attachments = ticket.attachments || [];
  const events = ticket.events || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl shadow-lg text-sm z-50">
          {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-1">
        <Link href="/usuario" className="hover:text-gray-700">Inicio</Link>
        <span className="text-gray-300">›</span>
        <Link href="/usuario/tickets" className="hover:text-gray-700">Mis Tickets</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-700 font-medium">{displayId}</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm mb-1">
          <span className="font-mono text-gray-500">ID {displayId}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColorMap[ticket.status] || 'bg-gray-100 text-gray-700'}`}>{statusLabelMap[ticket.status] || ticket.status}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColorMap[ticket.priority] || 'bg-gray-100 text-gray-700'}`}>{priorityLabelMap[ticket.priority] || ticket.priority}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>Tecnico asignado: <strong className="text-gray-900">{assigneeName}</strong></span>
          <span>Fecha de reporte: <strong className="text-gray-900">{dateStr}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <span className="text-base">📝</span> Tu Descripción
            </h2>
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{ticket.description}</p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Historial de Eventos</h2>
            {events.length === 0 ? (
              <p className="text-sm text-gray-400">No hay eventos registrados aun.</p>
            ) : (
              <div className="space-y-4">
                {events.map((e, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-green-600 mt-1" />
                      {i < events.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-gray-900">{e.type}</p>
                      <p className="text-xs text-gray-500">{e.description}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{new Date(e.created_at).toLocaleString('es-CO')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conversation */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Conversacion</h2>
            {comments.length === 0 ? (
              <p className="text-sm text-gray-400 mb-4">No hay comentarios aun.</p>
            ) : (
              <div className="space-y-4 mb-4">
                {comments.filter(c => !c.is_internal).map((c) => {
                  const isCurrentUser = c.user?.name === user?.name;
                  return (
                    <div key={c.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isCurrentUser ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-900">{isCurrentUser ? 'Tu' : c.user?.name}</span>
                          <span className="text-[10px] text-gray-400">{new Date(c.created_at).toLocaleString('es-CO')}</span>
                        </div>
                        <p className="text-sm text-gray-700">{c.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                placeholder="Escribe un comentario o actualizacion..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
              />
              <button
                onClick={handleSendComment}
                disabled={createComment.isPending || !comment.trim()}
                className="bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
              >
                {createComment.isPending ? 'Enviando...' : 'Enviar comentario'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Location Details */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Detalles de Ubicación</h3>
            <div className="space-y-3 text-sm">
              {[
                { icon: '📍', label: 'Sede', value: ticket.campus },
                { icon: '🏢', label: 'Ubicación', value: ticket.location },
                { icon: '🏷️', label: 'Categoría', value: ticket.category },
                { icon: '👤', label: 'Solicitante', value: ticket.requester?.name || 'N/A' },
              ].map((d) => (
                <div key={d.label} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5">{d.icon}</span>
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase">{d.label}</p>
                    <p className="text-gray-700">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Adjuntos ({attachments.length})</h3>
            {attachments.length === 0 ? (
              <p className="text-xs text-gray-400">Sin adjuntos</p>
            ) : (
              <div className="space-y-2">
                {attachments.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer transition-colors">
                    <span className="text-red-500 text-xs">📎</span>
                    <span className="text-gray-700 truncate flex-1">{a.file_name}</span>
                    {a.file_size && <span className="text-[11px] text-gray-400">{Math.round(a.file_size / 1024)} KB</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full bg-white border rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Reabrir ticket
            </button>
            <button className="w-full bg-white border rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Crear relacionado
            </button>
          </div>

          {/* Info banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800 leading-relaxed">
            <strong>Aviso importante:</strong> Para solicitar cambios urgentes o reportar fallos masivos, por favor contacte a la extensión 0234.
          </div>
        </div>
      </div>
    </div>
  );
}
