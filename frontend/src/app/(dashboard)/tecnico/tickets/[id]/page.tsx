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
  category: 'Hardware - Equipos de Computo',
  campus: 'Sede Bucaramanga',
  location: 'Lab. Informatica 3 - Aula 203',
  requester: { name: 'Carlos Mendez', role: 'Docente', email: 'cmendez@uts.edu.co' },
  assignee: { name: 'Andres Gomez', role: 'Tecnico de Soporte' },
  createdAt: '09/04/2025 14:30',
  asset: { name: 'Portatil UTS-001', serial: 'SN-2024-00412', type: 'Portatil Dell Latitude 5540' },
  description: 'Al intentar encender el equipo del docente en el aula 203, este emite una serie de pitidos cortos y la pantalla permanece en negro. El ventilador parece girar a maxima velocidad pero no hay senal de video ni carga del sistema operativo.\n\nSe probo cambiando el cable de poder pero el problema persiste. Es urgente ya que hay clases programadas para toda la semana en ese salon.',
};

const events = [
  { label: 'En Progreso', desc: 'El tecnico inicio la revision del hardware.', time: '10/04/2025 8:15 AM', color: 'bg-blue-500' },
  { label: 'Ticket Asignado', desc: 'Ticket asignado al tecnico Andres Gomez.', time: '10/04/2025 8:00 AM', color: 'bg-yellow-500' },
  { label: 'Ticket Creado', desc: 'Ticket registrado satisfactoriamente por el usuario.', time: '09/04/2025 14:30 PM', color: 'bg-green-600' },
];

const messages = [
  { sender: 'Carlos Mendez (Docente)', isTech: false, time: '09/04 2:30 PM', text: 'Buenas tardes, el computador del aula 203 no enciende. Necesito que por favor lo revisen, tengo clases toda la semana ahi.' },
  { sender: 'Andres Gomez (Tecnico)', isTech: true, time: '10/04 8:20 AM', text: 'He revisado la memoria RAM y parece que uno de los modulos esta fallando. Procedere a realizar una limpieza de contactos y si persiste, solicitare el repuesto a inventario.' },
  { sender: 'Carlos Mendez (Docente)', isTech: false, time: '10/04 11:42 AM', text: 'Entendido. Cree que el equipo este listo para la clase de las 2:00 PM o debo solicitar el traslado de los estudiantes a otro laboratorio?' },
];

export default function TecnicoTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [comment, setComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('in_progress');
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeNotes, setCloseNotes] = useState('');
  const [confirmRestore, setConfirmRestore] = useState(false);

  const actions = [
    {
      label: 'Agregar diagnostico',
      desc: 'Registra hallazgos tecnicos',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    },
    {
      label: 'Escalar Ticket',
      desc: 'Derivar a nivel superior',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
        </svg>
      ),
      color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
    },
    {
      label: 'Ver Historial',
      desc: 'Timeline completo del ticket',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    },
    {
      label: 'Cerrar Ticket',
      desc: 'Finalizar y documentar',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      onClick: () => setShowCloseModal(true),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-1">
        <Link href="/tecnico" className="hover:text-gray-700">Panel</Link>
        <span className="text-gray-300">/</span>
        <Link href="/tecnico" className="hover:text-gray-700">Mis Tickets</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">{ticket.id}</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm mb-1">
          <span className="font-mono text-gray-500 font-semibold">TICKET {ticket.id}</span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">{ticket.statusLabel}</span>
          <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-0.5 rounded-full font-medium">{ticket.priorityLabel}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>Solicitante: <strong className="text-gray-900">{ticket.requester.name}</strong></span>
          <span>Creado: <strong className="text-gray-900">{ticket.createdAt}</strong></span>
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

          {/* Status & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Update */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Estado del Ticket</h3>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                >
                  <option value="in_progress">En Progreso</option>
                  <option value="pending">Pendiente</option>
                  <option value="closed">Cerrado</option>
                </select>
                <button className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Actualizar
                </button>
              </div>
            </div>

            {/* Time Tracking */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Tiempo Invertido</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={timeMinutes}
                  onChange={(e) => setTimeMinutes(Number(e.target.value))}
                  min={0}
                  className="w-20 border rounded-lg px-3 py-2 text-sm text-center outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                />
                <span className="text-sm text-gray-500">mins</span>
                <button className="ml-auto bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Registrar
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`border rounded-xl p-4 text-left transition-colors ${action.color}`}
              >
                <div className="mb-2">{action.icon}</div>
                <p className="text-sm font-semibold">{action.label}</p>
                <p className="text-[11px] opacity-70 mt-0.5">{action.desc}</p>
              </button>
            ))}
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

          {/* Conversation / Seguimiento */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Seguimiento</h2>
            <div className="space-y-4 mb-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isTech ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.isTech ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
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
                placeholder="Escribe una respuesta o nota tecnica..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
              />
              <button className="bg-green-700 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap">
                Enviar
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Location Details */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Detalles del Ticket</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Sede', value: ticket.campus },
                { label: 'Ubicacion', value: ticket.location },
                { label: 'Categoria', value: ticket.category },
                { label: 'Solicitante', value: `${ticket.requester.name} (${ticket.requester.role})` },
                { label: 'Email', value: ticket.requester.email },
              ].map((d) => (
                <div key={d.label}>
                  <p className="text-[11px] text-gray-400 uppercase">{d.label}</p>
                  <p className="text-gray-700">{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activo Institucional */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Activo Institucional</h3>
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <p className="text-sm font-medium text-gray-900">{ticket.asset.name}</p>
              <p className="text-xs text-gray-500">{ticket.asset.type}</p>
              <p className="text-xs text-gray-400">S/N: {ticket.asset.serial}</p>
            </div>
            <button className="w-full mt-3 text-sm text-green-700 hover:text-green-600 font-medium hover:underline text-left">
              Ver hoja de vida del activo &rarr;
            </button>
          </div>

          {/* Assignee Info */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Tecnico Asignado</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-sm font-bold">
                AG
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{ticket.assignee.name}</p>
                <p className="text-xs text-gray-500">{ticket.assignee.role}</p>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800 leading-relaxed">
            <strong>Nota:</strong> Recuerda documentar todos los pasos realizados antes de cerrar el ticket. La documentacion completa ayuda a futuros diagnosticos.
          </div>
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
                Estas a punto de cerrar el ticket <strong>{ticket.id}</strong>. Describe los pasos realizados para resolver el problema.
              </p>
              <textarea
                value={closeNotes}
                onChange={(e) => setCloseNotes(e.target.value)}
                placeholder="Describe los pasos realizados para resolver el problema..."
                rows={4}
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 resize-none mb-4"
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
                <button
                  onClick={() => setShowCloseModal(false)}
                  className="flex-1 px-4 py-2.5 border rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  disabled={!confirmRestore || !closeNotes.trim()}
                  className="flex-1 px-4 py-3 bg-green-800 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Finalizar Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
