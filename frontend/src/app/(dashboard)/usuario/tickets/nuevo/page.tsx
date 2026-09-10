'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { CAMPUSES } from '@/lib/constants';
import api from '@/lib/api';
import { toast } from 'sonner';

type TicketType = 'incident' | 'request' | 'requirement' | null;
type Priority = 'low' | 'medium' | 'high' | 'critical';

const typeConfig = {
  incident: { label: 'Incidente', icon: '⚠️', desc: 'Algo dejó de funcionar correctamente o requiere arreglo.' , color: 'border-red-300 bg-red-50' },
  request: { label: 'Solicitud', icon: '📋', desc: 'Necesitas acceso a un servicio o una acción administrativa.' , color: 'border-blue-300 bg-blue-50' },
  requirement: { label: 'Requerimiento', icon: '⚙️', desc: 'Una mejora, instalación nueva o disponibilidad de recursos.' , color: 'border-purple-300 bg-purple-50' },
};

const categories = [
  'Hardware', 'Software', 'Redes e Infraestructura', 'Correo Electrónico',
  'Soporte Web', 'Accesos y Permisos', 'Impresoras', 'Telefonía', 'Otro',
];

const priorityConfig: Record<Priority, { label: string; color: string; dot: string }> = {
  low: { label: 'Baja', color: 'border-gray-300', dot: 'bg-gray-400' },
  medium: { label: 'Media', color: 'border-yellow-300', dot: 'bg-yellow-500' },
  high: { label: 'Alta · Crítico / No puedo trabajar', color: 'border-orange-300', dot: 'bg-orange-500' },
  critical: { label: 'Urgente · Afecta a múltiples usuarios', color: 'border-red-300', dot: 'bg-red-500' },
};

export default function NuevoTicketPage() {
  const [type, setType] = useState<TicketType>(null);
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [campus, setCampus] = useState('');
  const [location, setLocation] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isValid = type && category && subject.trim().length > 5 && campus;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    setUploadProgress(null);
    try {
      const { data: newTicket } = await api.post('/tickets', {
        title: subject,
        description,
        category,
        priority,
        campus,
        location,
        type,
      });

      // Subir archivos adjuntos si hay
      if (files.length > 0) {
        const ticketId = newTicket.id;
        for (let i = 0; i < files.length; i++) {
          setUploadProgress(`Subiendo archivo ${i + 1} de ${files.length}: ${files[i].name}`);
          const formData = new FormData();
          formData.append('file', files[i]);
          try {
            await api.post(`/tickets/${ticketId}/attachments`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          } catch {
            toast.error(`Error al subir: ${files[i].name}`);
          }
        }
        setUploadProgress(null);
      }

      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Ocurrio un error al enviar el ticket. Intenta de nuevo.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Solicitud enviada exitosamente</h1>
        <p className="text-gray-500 mb-6">Tu ticket ha sido registrado y será asignado a un técnico. Recibirás notificaciones sobre su estado.</p>
        <div className="flex justify-center gap-3">
          <Link href="/usuario" className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">Volver al inicio</Link>
          <Link href="/usuario/tickets" className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Ver mis tickets</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1">
        <Link href="/usuario" className="hover:text-gray-700">Inicio</Link>
        <span className="text-gray-300">›</span>
        <Link href="/usuario/tickets" className="hover:text-gray-700">Mis Tickets</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-700 font-medium">Crear Ticket</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900">Nueva Solicitud de Soporte</h1>
      <p className="text-gray-500 text-sm mb-6">Completa la información detallada para que nuestro equipo académico pueda resolver tu incidencia o requerimiento con la mayor agilidad posible.</p>

      <div className="space-y-6">
        {/* 1. Classification */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-800 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            Clasificación de la Solicitud
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {(Object.entries(typeConfig) as [TicketType & string, typeof typeConfig.incident][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setType(key as TicketType)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${type === key ? cfg.color + ' ring-2 ring-offset-1 ring-green-500' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="text-xl">{cfg.icon}</span>
                <p className="font-medium text-gray-900 mt-2">{cfg.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{cfg.desc}</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600">
                <option value="">Seleccione una opción</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prioridad</label>
              <div className="space-y-1.5">
                {(Object.entries(priorityConfig) as [Priority, typeof priorityConfig.low][]).map(([key, cfg]) => (
                  <label key={key} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${priority === key ? cfg.color + ' bg-opacity-10' : 'border-transparent hover:bg-gray-50'}`}>
                    <input type="radio" name="priority" checked={priority === key} onChange={() => setPriority(key)} className="sr-only" />
                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                    <span className="text-sm text-gray-700">{cfg.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Details */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-800 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            Detalle del Problema
          </h2>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Asunto</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Fallo en conexión Wi-Fi"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 ${subject && subject.length < 6 ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`}
              />
              {subject && subject.length < 6 && (
                <p className="text-xs text-red-500 mt-1">El asunto es demasiado corto. Proporciona más contexto.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción detallada <span className="text-gray-400 font-normal">0/500</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Describa el problema con el mayor detalle posible, incluyendo códigos de error si los hay."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 resize-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Location */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-800 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            Ubicación Física
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sede</label>
              <select value={campus} onChange={(e) => setCampus(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600">
                <option value="">Seleccione sede</option>
                {CAMPUSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ubicación específica</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Laboratorio de Cómputo B-305, Cubículo 5"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
              />
            </div>
          </div>
        </div>

        {/* 4. Attachments */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-800 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
            Adjuntos y Evidencia
          </h2>
          <div className="mt-4">
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50/30 transition-all"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">📎</div>
              <p className="text-sm font-medium text-gray-700">Arrastra archivos aquí o haz clic</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF (Máx. 10 MB por archivo)</p>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                    <span className="text-gray-700 truncate">{f.name}</span>
                    <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700 text-xs ml-2">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upload progress */}
        {uploadProgress && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            {uploadProgress}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Disclaimer + Actions */}
        <div className="text-xs text-gray-400 leading-relaxed">
          Al enviar esta solicitud, usted acepta que el personal de TI acceda a la información técnica necesaria para la resolución de su caso bajo las directivas de la institución.
        </div>
        <div className="flex justify-end gap-3 pb-4">
          <Link href="/usuario/tickets" className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancelar
          </Link>
          <button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="bg-green-800 hover:bg-green-700 disabled:bg-green-800/50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Enviando...
              </>
            ) : (
              'Enviar solicitud →'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
