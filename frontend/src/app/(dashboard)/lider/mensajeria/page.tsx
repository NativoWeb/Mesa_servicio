'use client';

import { useState } from 'react';
import { useMessages, useCreateMessage, useSendMessage } from '@/hooks/use-messages';
import { CAMPUSES } from '@/lib/constants';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { MessageChannel } from '@/types/message';

const ROLE_OPTIONS = [
  { value: 'technician', label: 'Tecnicos' },
  { value: 'end_user', label: 'Usuarios Finales' },
  { value: 'asset_holder', label: 'Cuentadantes' },
  { value: 'inventory_manager', label: 'Gestores Inventario' },
];

export default function MensajeriaPage() {
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
      <h1 className="text-2xl font-bold text-gray-900">Mensajeria Masiva</h1>
      <p className="text-gray-500 mb-6">Envia comunicaciones a usuarios de la plataforma</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Configuracion del Mensaje</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Canal de envio</label>
              <div className="flex gap-2">
                {([['email', 'Correo'], ['sms', 'SMS'], ['both', 'Ambos']] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setChannel(val)}
                    className={`px-4 py-2 border rounded-lg text-sm transition-colors ${channel === val ? 'bg-green-50 border-green-300 text-green-800 font-medium' : 'hover:bg-gray-50'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asunto del mensaje</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/20" placeholder="Ej: Actualizacion obligatoria de plataforma" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuerpo del mensaje</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full px-4 py-2 border rounded-lg h-32 text-sm outline-none focus:ring-2 focus:ring-green-500/20 resize-none" placeholder="Escribe el contenido institucional aqui..." />
            </div>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {isSending ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Segmentacion de Audiencia</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por rol</label>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                <option value="">Todos los roles</option>
                {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por sede</label>
              <select value={campusFilter} onChange={e => setCampusFilter(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                <option value="">Todas las sedes</option>
                {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de mensajes */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Historial de Mensajes</h2>
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : !messagesData?.data.length ? (
          <p className="text-gray-400 text-center py-8">No hay mensajes enviados</p>
        ) : (
          <div className="space-y-2">
            {messagesData.data.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium text-gray-900">{m.subject}</p>
                  <p className="text-xs text-gray-500">
                    {m.channel === 'email' ? 'Email' : m.channel === 'sms' ? 'SMS' : 'Email + SMS'}
                    {' · '}{m.sender?.name || 'N/A'}
                    {' · '}{formatDistanceToNow(new Date(m.created_at), { locale: es, addSuffix: true })}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.status === 'sent' ? 'bg-green-100 text-green-700' : m.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'}`}>
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
