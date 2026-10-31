'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { FileText, MapPin, Building2, Tag, User, Paperclip, Monitor } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { useComments, useCreateComment } from '@/hooks/use-comments';
import { toast as sonnerToast } from 'sonner';

async function handleDownload(attachmentId: number, fileName: string) {
  try {
    const res = await api.get(`/attachments/${attachmentId}/download`, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    sonnerToast.error('Error al descargar el archivo');
  }
}

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
  open: 'bg-[var(--med-bg)] text-[var(--med)]',
  in_progress: 'bg-[var(--info-bg)] text-[var(--info)]',
  pending: 'bg-[var(--high-bg)] text-[var(--high)]',
  closed: 'bg-[var(--low-bg)] text-[var(--selva-500)]',
};

const priorityColorMap: Record<string, string> = {
  low: 'bg-[var(--surface-3)] text-[var(--ink-2)]',
  medium: 'bg-[var(--med-bg)] text-[var(--med)]',
  high: 'bg-[var(--high-bg)] text-[var(--high)]',
  critical: 'bg-[var(--crit-bg)] text-[var(--crit)]',
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
  asset_id?: number | null;
  asset?: { id: number; asset_code: string; name: string; category: string; serial_number?: string; serial?: string; campus?: string } | null;
  requester?: { name: string };
  assigned_user?: { name: string; role?: string } | null;
  comments?: { id: number; body: string; user: { name: string }; created_at: string; is_internal: boolean }[];
  attachments?: { id: number; file_name: string; file_size?: number }[];
  events?: { type: string; description: string; created_at: string }[];
}

export default function UsuarioTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [comment, setComment] = useState('');
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
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
        // ticket stays null on error
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

  if (loading || !ticket) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <svg className="animate-spin h-8 w-8 mx-auto text-[var(--selva-500)] mb-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        <p className="text-sm text-[var(--muted)]">{loading ? 'Cargando ticket...' : 'No se pudo cargar el ticket.'}</p>
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
        <div className="fixed top-6 right-6 bg-[var(--med-bg)] border border-[var(--line-2)] text-[var(--med)] px-4 py-3 rounded-xl shadow-lg text-sm z-50">
          {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="text-xs text-[var(--muted)] flex items-center gap-1">
        <Link href="/usuario" className="hover:text-[var(--ink-2)]">Inicio</Link>
        <span className="text-[var(--faint)]">›</span>
        <Link href="/usuario/tickets" className="hover:text-[var(--ink-2)]">Mis Tickets</Link>
        <span className="text-[var(--faint)]">›</span>
        <span className="text-[var(--ink-2)] font-medium">{displayId}</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm mb-1">
          <span className="font-mono text-[var(--muted)]">ID {displayId}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColorMap[ticket.status] || 'bg-[var(--surface-3)] text-[var(--ink-2)]'}`}>{statusLabelMap[ticket.status] || ticket.status}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColorMap[ticket.priority] || 'bg-[var(--surface-3)] text-[var(--ink-2)]'}`}>{priorityLabelMap[ticket.priority] || ticket.priority}</span>
        </div>
        <h1 className="text-xl font-bold text-[var(--ink)]">{ticket.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-[var(--muted)]">
          <span>Técnico asignado: <strong className="text-[var(--ink)]">{assigneeName}</strong></span>
          <span>Fecha de reporte: <strong className="text-[var(--ink)]">{dateStr}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="nw-card card-pad">
            <h2 className="font-semibold text-[var(--ink)] flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[var(--muted)]" /> Tu Descripción
            </h2>
            <p className="text-sm text-[var(--ink-2)] whitespace-pre-line leading-relaxed">{ticket.description}</p>
          </div>

          {/* Timeline */}
          <div className="nw-card card-pad">
            <h2 className="font-semibold text-[var(--ink)] mb-4">Historial de Eventos</h2>
            {events.length === 0 ? (
              <p className="text-sm text-[var(--faint)]">No hay eventos registrados aun.</p>
            ) : (
              <div className="space-y-4">
                {events.map((e, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[var(--selva-500)] mt-1" />
                      {i < events.length - 1 && <div className="w-px flex-1 bg-[var(--line)] mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-[var(--ink)]">{e.type}</p>
                      <p className="text-xs text-[var(--muted)]">{e.description}</p>
                      <p className="text-[11px] text-[var(--faint)] mt-0.5">{new Date(e.created_at).toLocaleString('es-CO')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conversation */}
          <div className="nw-card card-pad">
            <h2 className="font-semibold text-[var(--ink)] mb-4">Conversacion</h2>
            {comments.length === 0 ? (
              <p className="text-sm text-[var(--faint)] mb-4">No hay comentarios aun.</p>
            ) : (
              <div className="space-y-4 mb-4">
                {comments.filter((c: any) => !c.is_internal).map((c: any) => {
                  const isCurrentUser = c.user?.name === user?.name;
                  return (
                    <div key={c.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isCurrentUser ? 'bg-[var(--low-bg)] border border-[var(--line)]' : 'bg-[var(--surface-3)]'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-[var(--ink)]">{isCurrentUser ? 'Tu' : c.user?.name}</span>
                          <span className="text-[10px] text-[var(--faint)]">{new Date(c.created_at).toLocaleString('es-CO')}</span>
                        </div>
                        <p className="text-sm text-[var(--ink-2)]">{c.body}</p>
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
                className="nw-input flex-1"
              />
              <button
                onClick={handleSendComment}
                disabled={createComment.isPending || !comment.trim()}
                className="nw-btn primary disabled:opacity-50 whitespace-nowrap"
              >
                {createComment.isPending ? 'Enviando...' : 'Enviar comentario'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Location Details */}
          <div className="nw-card card-pad">
            <h3 className="font-semibold text-[var(--ink)] text-sm mb-3">Detalles de Ubicación</h3>
            <div className="space-y-3 text-sm">
              {[
                { icon: MapPin, label: 'Sede', value: ticket.campus },
                { icon: Building2, label: 'Ubicación', value: ticket.location },
                { icon: Tag, label: 'Categoría', value: ticket.category },
                { icon: User, label: 'Solicitante', value: ticket.requester?.name || 'N/A' },
              ].map((d) => (
                <div key={d.label} className="flex items-start gap-2">
                  <d.icon className="w-3.5 h-3.5 text-[var(--faint)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] text-[var(--faint)] uppercase">{d.label}</p>
                    <p className="text-[var(--ink-2)]">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linked Asset */}
          {ticket.asset && (
            <div className="nw-card card-pad">
              <h3 className="font-semibold text-[var(--ink)] text-sm mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[var(--selva-500)]" />
                Equipo Vinculado
              </h3>
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-[var(--ink)]">
                  <span className="font-mono text-[var(--selva-500)]">[{ticket.asset.asset_code}]</span> {ticket.asset.name}
                </p>
                {(ticket.asset.serial_number || ticket.asset.serial) && (
                  <p className="text-xs text-[var(--muted)]">Serial: {ticket.asset.serial_number || ticket.asset.serial}</p>
                )}
                {ticket.asset.campus && (
                  <p className="text-xs text-[var(--muted)]">Sede: {ticket.asset.campus}</p>
                )}
                <p className="text-xs text-[var(--faint)] capitalize">{ticket.asset.category}</p>
              </div>
            </div>
          )}

          {/* Attachments */}
          <div className="nw-card card-pad">
            <h3 className="font-semibold text-[var(--ink)] text-sm mb-3">Adjuntos ({attachments.length})</h3>
            {attachments.length === 0 ? (
              <p className="text-xs text-[var(--faint)]">Sin adjuntos</p>
            ) : (
              <div className="space-y-2">
                {attachments.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 bg-[var(--canvas)] rounded-lg px-3 py-2 text-sm hover:bg-[var(--surface-3)] transition-colors">
                    <Paperclip className="w-3.5 h-3.5 text-[var(--faint)] shrink-0" />
                    <span className="text-[var(--ink-2)] truncate flex-1">{a.file_name}</span>
                    {a.file_size && <span className="text-[11px] text-[var(--faint)]">{Math.round(a.file_size / 1024)} KB</span>}
                    <button
                      onClick={() => handleDownload(a.id, a.file_name)}
                      className="text-[var(--selva-500)] hover:text-[var(--selva-500)] text-xs font-medium shrink-0"
                    >
                      Descargar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button className="nw-btn w-full">
              Reabrir ticket
            </button>
            <button className="nw-btn w-full">
              Crear relacionado
            </button>
          </div>

          {/* Info banner */}
          <div className="banner warn text-xs leading-relaxed">
            <strong>Aviso importante:</strong> Para solicitar cambios urgentes o reportar fallos masivos, por favor contacte a la extensión 0234.
          </div>
        </div>
      </div>
    </div>
  );
}
