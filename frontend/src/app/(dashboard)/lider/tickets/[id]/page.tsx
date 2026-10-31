'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useTicket, useUpdateTicket } from '@/hooks/use-tickets';
import { useComments, useCreateComment } from '@/hooks/use-comments';
import { useUsers } from '@/hooks/use-users';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';
import api from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LinkedAssetCard } from '@/components/tickets/linked-asset-card';
import { AssetSearchInput } from '@/components/tickets/asset-search-input';

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
    toast.error('Error al descargar el archivo');
  }
}

export default function LiderTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const ticketId = Number(id);
  const { data: ticket, isLoading } = useTicket(ticketId);
  const updateTicket = useUpdateTicket();
  const { data: commentsData } = useComments('tickets', ticketId);
  const createComment = useCreateComment('tickets', ticketId);
  const { data: technicians } = useUsers({ role: 'technician', per_page: 50 });

  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [comment, setComment] = useState('');
  const [isInternal, setIsInternal] = useState(true);
  const [showLinkAsset, setShowLinkAsset] = useState(false);
  const [linkingAsset, setLinkingAsset] = useState(false);

  if (isLoading || !ticket) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-6 bg-[var(--line)] rounded w-48 animate-pulse" />
        <div className="h-8 bg-[var(--line)] rounded w-2/3 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-[var(--surface-3)] rounded-xl animate-pulse" />
          <div className="h-64 bg-[var(--surface-3)] rounded-xl animate-pulse" />
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

  const handleReassign = async () => {
    if (!selectedTech) return;
    try {
      await updateTicket.mutateAsync({
        id: ticketId,
        assigned_to: Number(selectedTech),
        status: 'in_progress',
      });
      toast.success('Ticket reasignado correctamente');
      setSelectedTech('');
    } catch {
      toast.error('Error al reasignar ticket');
    }
  };

  const handleSendComment = () => {
    if (!comment.trim()) return;
    createComment.mutateAsync({ body: comment, is_internal: isInternal })
      .then(() => { setComment(''); toast.success('Comentario enviado'); })
      .catch(() => toast.error('Error al enviar comentario'));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-[var(--muted)] flex items-center gap-1">
        <Link href="/lider" className="hover:text-[var(--ink-2)]">Panel</Link>
        <span className="text-[var(--faint)]">/</span>
        <Link href="/lider/tickets" className="hover:text-[var(--ink-2)]">Tickets</Link>
        <span className="text-[var(--faint)]">/</span>
        <span className="text-[var(--ink-2)] font-medium">#{ticket.id}</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm mb-1">
          <span className="font-mono text-[var(--muted)] font-semibold">TICKET #{ticket.id}</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${sCfg?.color || ''}`}>{sCfg?.label || ticket.status}</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${pCfg?.color || ''}`}>{pCfg?.label || ticket.priority}</span>
        </div>
        <h1 className="text-xl font-bold text-[var(--ink)]">{ticket.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-[var(--muted)]">
          <span>Solicitante: <strong className="text-[var(--ink)]">{ticket.requester?.name || 'N/A'}</strong></span>
          <span>Creado: <strong className="text-[var(--ink)]">{format(new Date(ticket.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-[var(--surface)] rounded-xl border p-6">
            <h2 className="font-semibold text-[var(--ink)] mb-3">Descripción del problema</h2>
            <p className="text-sm text-[var(--ink-2)] whitespace-pre-line leading-relaxed">{ticket.description}</p>
          </div>

          {/* Status Update */}
          {ticket.status !== 'closed' && (
            <div className="bg-[var(--surface)] rounded-xl border p-5">
              <h3 className="font-semibold text-[var(--ink)] text-sm mb-3">Cambiar Estado</h3>
              <div className="flex gap-2">
                <select
                  value={selectedStatus || ticket.status}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm bg-[var(--surface)] outline-none focus:shadow-[var(--focus)]"
                >
                  <option value="open">Abierto</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="pending">Pendiente</option>
                  <option value="escalated">Escalado</option>
                  <option value="closed">Cerrado</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updateTicket.isPending}
                  className="bg-[var(--lima-500)] hover:bg-[var(--lima-400)] disabled:bg-[var(--line)] text-[var(--lima-ink)] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {updateTicket.isPending ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            </div>
          )}

          {/* Reassign */}
          {ticket.status !== 'closed' && (
            <div className="bg-[var(--surface)] rounded-xl border p-5">
              <h3 className="font-semibold text-[var(--ink)] text-sm mb-3">Reasignar Técnico</h3>
              <div className="flex gap-2">
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm bg-[var(--surface)] outline-none focus:shadow-[var(--focus)]"
                >
                  <option value="">Seleccionar técnico</option>
                  {technicians?.data.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} {t.campus ? `(${t.campus})` : ''}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleReassign}
                  disabled={!selectedTech || updateTicket.isPending}
                  className="bg-[var(--info)] hover:bg-[var(--info)] disabled:bg-[var(--line)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Reasignar
                </button>
              </div>
              {ticket.assignee && (
                <p className="text-xs text-[var(--muted)] mt-2">
                  Actualmente asignado a: <strong>{ticket.assignee.name}</strong>
                </p>
              )}
            </div>
          )}

          {/* Timeline */}
          {ticket.events && ticket.events.length > 0 && (
            <div className="bg-[var(--surface)] rounded-xl border p-6">
              <h2 className="font-semibold text-[var(--ink)] mb-4">Historial de Eventos</h2>
              <div className="space-y-4">
                {ticket.events.map((e, i) => (
                  <div key={e.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[var(--selva-500)] mt-1" />
                      {i < ticket.events!.length - 1 && <div className="w-px flex-1 bg-[var(--line)] mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-[var(--ink)]">{e.description}</p>
                      <p className="text-[11px] text-[var(--faint)] mt-0.5">
                        {e.user?.name} &middot; {format(new Date(e.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="bg-[var(--surface)] rounded-xl border p-6">
            <h2 className="font-semibold text-[var(--ink)] mb-4">Seguimiento</h2>
            {(() => {
              const allComments = commentsData?.data || ticket.comments || [];
              return allComments.length > 0 ? (
                <div className="space-y-4 mb-4">
                  {allComments.map((m: { id: number; is_internal: boolean; user?: { name: string }; created_at: string; body: string }) => (
                    <div key={m.id} className={`flex ${m.is_internal ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.is_internal ? 'bg-[var(--low-bg)] border border-[var(--selva-500)]/20' : 'bg-[var(--surface-3)]'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-[var(--ink)]">{m.user?.name || 'N/A'}</span>
                          <span className="text-[10px] text-[var(--faint)]">{format(new Date(m.created_at), 'dd/MM HH:mm')}</span>
                          {m.is_internal && <span className="text-[9px] bg-[var(--med-bg)] text-[var(--med)] px-1.5 py-0.5 rounded">Interna</span>}
                        </div>
                        <p className="text-sm text-[var(--ink-2)]">{m.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--faint)] mb-4">No hay comentarios aún.</p>
              );
            })()}

            <h3 className="font-semibold text-[var(--ink)] text-sm mb-3">Agregar comentario</h3>
            <div className="mb-2">
              <button
                type="button"
                onClick={() => setIsInternal(!isInternal)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isInternal
                    ? 'bg-[var(--med-bg)] border-[var(--med)] text-[var(--med)]'
                    : 'bg-[var(--info-bg)] border-[var(--info)] text-[var(--info)]'
                }`}
              >
                {isInternal ? (
                  <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> Nota interna</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> Respuesta al usuario</>
                )}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                placeholder={isInternal ? 'Escribe una nota interna para el equipo...' : 'Escribe una respuesta visible para el usuario...'}
                className="flex-1 px-4 py-2.5 bg-[var(--canvas)] border border-[var(--line)] rounded-xl text-sm outline-none focus:shadow-[var(--focus)]"
              />
              <button
                onClick={handleSendComment}
                disabled={createComment.isPending || !comment.trim()}
                className="bg-[var(--lima-500)] hover:bg-[var(--lima-400)] disabled:bg-[var(--line)] text-[var(--lima-ink)] px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
              >
                {createComment.isPending ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="bg-[var(--surface)] rounded-xl border p-5">
            <h3 className="font-semibold text-[var(--ink)] text-sm mb-3">Detalles del Ticket</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Sede', value: ticket.campus },
                { label: 'Ubicación', value: ticket.location || '-' },
                { label: 'Categoría', value: ticket.category || '-' },
                { label: 'Solicitante', value: ticket.requester?.name || 'N/A' },
                { label: 'Email', value: ticket.requester?.email || '-' },
              ].map((d) => (
                <div key={d.label}>
                  <p className="text-[11px] text-[var(--faint)] uppercase">{d.label}</p>
                  <p className="text-[var(--ink-2)]">{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          {ticket.assignee && (
            <div className="bg-[var(--surface)] rounded-xl border p-5">
              <h3 className="font-semibold text-[var(--ink)] text-sm mb-3">Técnico Asignado</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--low-bg)] flex items-center justify-center text-[var(--selva-500)] text-sm font-bold">
                  {ticket.assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">{ticket.assignee.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Linked Asset */}
          {ticket.asset ? (
            <LinkedAssetCard asset={ticket.asset} />
          ) : ticket.status !== 'closed' && (
            <div className="bg-[var(--surface)] rounded-xl border p-5">
              {showLinkAsset ? (
                <div>
                  <h3 className="font-semibold text-[var(--ink)] text-sm mb-3">Vincular Equipo</h3>
                  <AssetSearchInput
                    value={null}
                    onChange={async (asset) => {
                      if (!asset) return;
                      setLinkingAsset(true);
                      try {
                        await updateTicket.mutateAsync({ id: ticketId, asset_id: asset.id });
                        toast.success('Equipo vinculado al ticket');
                        setShowLinkAsset(false);
                      } catch {
                        toast.error('Error al vincular equipo');
                      } finally {
                        setLinkingAsset(false);
                      }
                    }}
                  />
                  {linkingAsset && <p className="text-xs text-[var(--faint)] mt-2">Vinculando...</p>}
                  <button
                    type="button"
                    onClick={() => setShowLinkAsset(false)}
                    className="text-xs text-[var(--muted)] hover:text-[var(--ink-2)] mt-2"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLinkAsset(true)}
                  className="w-full text-sm text-[var(--selva-500)] font-medium hover:text-[var(--selva-500)] py-1 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  Vincular equipo
                </button>
              )}
            </div>
          )}

          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="bg-[var(--surface)] rounded-xl border p-5">
              <h3 className="font-semibold text-[var(--ink)] text-sm mb-3">Adjuntos ({ticket.attachments.length})</h3>
              <div className="space-y-2">
                {ticket.attachments.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 bg-[var(--canvas)] rounded-lg px-3 py-2 text-sm">
                    <span className="text-[var(--ink-2)] truncate flex-1">{a.file_name}</span>
                    <button
                      onClick={() => handleDownload(a.id, a.file_name)}
                      className="text-[var(--selva-500)] hover:text-[var(--selva-500)] text-xs font-medium shrink-0"
                    >
                      Descargar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
