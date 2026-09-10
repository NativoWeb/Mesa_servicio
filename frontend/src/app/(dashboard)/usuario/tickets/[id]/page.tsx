'use client';

import { useState, use } from 'react';
import Link from 'next/link';

const ticket = {
  id: '#T-0042',
  title: 'Computador del aula 203 no enciende',
  status: 'in_progress',
  statusLabel: 'En Progreso',
  priority: 'high',
  priorityLabel: 'Alta',
  assignee: { name: 'Andrés Gómez', role: 'Técnico de Soporte' },
  createdAt: '15/04/2025',
  campus: 'Sede Bucaramanga',
  location: 'Lab. Informática 3 - Aula 203',
  category: 'Hardware - Equipos de Cómputo',
  requesterType: 'Usuario Docente',
  description: `Al intentar encender el equipo del docente en el aula 203, este emite una serie de pitidos cortos y la pantalla permanece en negro. El ventilador parece girar a máxima velocidad pero no hay señal de video ni carga del sistema operativo.\n\nSe probó cambiando el cable de poder pero el problema persiste. Es urgente ya que hay clases programadas para toda la semana en ese salón.`,
};

const events = [
  { type: 'status', label: 'En Progreso', desc: 'El técnico inició la revisión del hardware.', time: '10/04/2025 8:15 AM', color: 'bg-blue-500' },
  { type: 'assignment', label: 'Ticket Asignado', desc: 'Ticket asignado al técnico Andrés Gómez.', time: '10/04/2025 8:00 AM', color: 'bg-yellow-500' },
  { type: 'created', label: 'Ticket Creado', desc: 'Ticket registrado satisfactoriamente por el usuario.', time: '09/04/2025 14:30 PM', color: 'bg-green-600' },
];

const messages = [
  { sender: 'Andrés Gómez (Técnico)', isUser: false, time: '11:00 AM', text: 'He revisado la memoria RAM y parece que uno de los módulos está fallando. Procederé a realizar una limpieza de contactos y si persiste, solicitaré el repuesto a inventario.' },
  { sender: 'Tú', isUser: true, time: '11:42 AM', text: '¿Entendido. ¿Cree que el equipo esté listo para la clase de las 2:00 PM o debo solicitar el traslado de los estudiantes a otro laboratorio?' },
];

const attachments = [
  { name: 'error_boot_screen.jpg', size: '245 KB' },
  { name: 'reporte_tecnico_anteri...', size: '1.2 MB' },
];

export default function UsuarioTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [comment, setComment] = useState('');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-1">
        <Link href="/usuario" className="hover:text-gray-700">Inicio</Link>
        <span className="text-gray-300">›</span>
        <Link href="/usuario/tickets" className="hover:text-gray-700">Mis Tickets</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-700 font-medium">{ticket.id}</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm mb-1">
          <span className="font-mono text-gray-500">ID {ticket.id}</span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">{ticket.statusLabel}</span>
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-medium">{ticket.priorityLabel}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>Técnico asignado: <strong className="text-gray-900">{ticket.assignee.name}</strong></span>
          <span>Fecha de reporte: <strong className="text-gray-900">{ticket.createdAt}</strong></span>
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
            <div className="space-y-4">
              {events.map((e, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${e.color} mt-1`} />
                    {i < events.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-gray-900">{e.label}</p>
                    <p className="text-xs text-gray-500">{e.desc}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Conversación</h2>
            <div className="space-y-4 mb-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.isUser ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-900">{m.sender}</span>
                      <span className="text-[10px] text-gray-400">{m.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe un comentario o actualización..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
              />
              <button className="bg-green-700 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap">
                Enviar comentario →
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
                { icon: '👤', label: 'Solicitante', value: ticket.requesterType },
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
            <div className="space-y-2">
              {attachments.map((a, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer transition-colors">
                  <span className="text-red-500 text-xs">📎</span>
                  <span className="text-gray-700 truncate flex-1">{a.name}</span>
                  <span className="text-[11px] text-gray-400">{a.size}</span>
                </div>
              ))}
            </div>
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
