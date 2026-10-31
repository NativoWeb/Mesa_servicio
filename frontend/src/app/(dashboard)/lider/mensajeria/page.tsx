'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMessages, useCreateMessage, useSendMessage } from '@/hooks/use-messages';
import { CAMPUSES } from '@/lib/constants';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText } from 'lucide-react';
import type { MessageChannel } from '@/types/message';

const ROLE_OPTIONS = [
  { value: 'technician', label: 'Tecnicos' },
  { value: 'end_user', label: 'Usuarios Finales' },
  { value: 'asset_holder', label: 'Cuentadantes' },
  { value: 'inventory_manager', label: 'Gestores Inventario' },
];

export default function MensajeriaPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-[var(--surface-3)] rounded-xl" />}>
      <MensajeriaContent />
    </Suspense>
  );
}

function TemplatesPlaceholder() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Plantillas de Mensajes</h1>
          <p>Crea y gestiona plantillas reutilizables para tus comunicaciones</p>
        </div>
      </div>
      <div className="nw-card p-12 text-center">
        <div className="w-16 h-16 bg-[var(--surface-3)] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-[var(--faint)]" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-2">Proximamente</h2>
        <p className="text-[var(--muted)] max-w-md mx-auto">
          Aqui podras crear plantillas de correo y SMS personalizables con variables dinamicas
          para agilizar tus comunicaciones institucionales.
        </p>
      </div>
    </div>
  );
}

function MensajeriaContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || '';

  if (activeTab === 'templates') {
    return <TemplatesPlaceholder />;
  }

  return <MensajeriaForm />;
}

function MensajeriaForm() {
  const [channel, setChannel] = useState<MessageChannel>('email');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [campusFilter, setCampusFilter] = useState('');

  const { data: messagesData, isLoading } = useMessages({ per_page: 10 });
  const createMessage = useCreateMessage();
  const sendMessage = useSendMessage();

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error('Completa asunto y cuerpo del mensaje');
      return;
    }
    try {
      const msg = await createMessage.mutateAsync({
        subject,
        body,
        channel,
        recipients_filter: {
          ...(roleFilter && { role: roleFilter }),
          ...(campusFilter && { campus: campusFilter }),
        },
        status: 'draft',
      });
      await sendMessage.mutateAsync(msg.id);
      toast.success('Mensaje enviado correctamente');
      setSubject('');
      setBody('');
    } catch {
      toast.error('Error al enviar el mensaje');
    }
  };

  const isSending = createMessage.isPending || sendMessage.isPending;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Mensajeria Masiva</h1>
          <p>Envia comunicaciones a usuarios de la plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 nw-card card-pad">
          <h2 className="font-semibold mb-4">Configuracion del Mensaje</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--ink-2)] mb-1">Canal de envio</label>
              <div className="seg">
                {([['email', 'Correo'], ['sms', 'SMS'], ['both', 'Ambos']] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setChannel(val)}
                    className={channel === val ? 'on' : ''}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--ink-2)] mb-1">Asunto del mensaje</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} className="nw-input" placeholder="Ej: Actualizacion obligatoria de plataforma" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--ink-2)] mb-1">Cuerpo del mensaje</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} className="nw-input h-32 resize-none" placeholder="Escribe el contenido institucional aqui..." />
            </div>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="nw-btn primary disabled:bg-[var(--surface-3)]"
            >
              {isSending ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </div>
        </div>

        <div className="nw-card card-pad">
          <h2 className="font-semibold mb-4">Segmentacion de Audiencia</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--ink-2)] mb-1">Filtrar por rol</label>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="nw-input">
                <option value="">Todos los roles</option>
                {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--ink-2)] mb-1">Filtrar por sede</label>
              <select value={campusFilter} onChange={e => setCampusFilter(e.target.value)} className="nw-input">
                <option value="">Todas las sedes</option>
                {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de mensajes */}
      <div className="nw-card card-pad">
        <h2 className="font-semibold mb-4">Historial de Mensajes</h2>
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-[var(--surface-3)] rounded animate-pulse" />)}</div>
        ) : !messagesData?.data.length ? (
          <p className="text-[var(--faint)] text-center py-8">No hay mensajes enviados</p>
        ) : (
          <div className="space-y-2">
            {messagesData.data.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">{m.subject}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {m.channel === 'email' ? 'Email' : m.channel === 'sms' ? 'SMS' : 'Email + SMS'}
                    {' · '}{m.sender?.name || 'N/A'}
                    {' · '}{formatDistanceToNow(new Date(m.created_at), { locale: es, addSuffix: true })}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.status === 'sent' ? 'bg-[var(--low-bg)] text-[var(--selva-500)]' : m.status === 'draft' ? 'bg-[var(--surface-3)] text-[var(--ink-2)]' : 'bg-[var(--med-bg)] text-[var(--med)]'}`}>
                  {m.status === 'sent' ? 'Enviado' : m.status === 'draft' ? 'Borrador' : 'Enviando'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
