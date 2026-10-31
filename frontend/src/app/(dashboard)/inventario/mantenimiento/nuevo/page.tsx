'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Wrench, Package, Sparkles, Monitor } from 'lucide-react';
import { useCreateMaintenance } from '@/hooks/use-maintenances';
import { useAsset } from '@/hooks/use-assets';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { MaintenanceType } from '@/types/maintenance';

const typeConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  preventive: { label: 'Preventivo', icon: Shield },
  corrective: { label: 'Correctivo', icon: Wrench },
  update: { label: 'Actualización', icon: Package },
  cleaning: { label: 'Limpieza', icon: Sparkles },
};

export default function NuevoMantenimientoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assetIdParam = searchParams.get('asset_id');
  const user = useAuthStore(s => s.user);
  const createMaintenance = useCreateMaintenance();

  const { data: asset } = useAsset(assetIdParam ? Number(assetIdParam) : 0);

  const [type, setType] = useState<MaintenanceType | ''>('');
  const [description, setDescription] = useState('');
  const [startedAt, setStartedAt] = useState('');
  const [finishedAt, setFinishedAt] = useState('');
  const [status, setStatus] = useState('completed');
  const [finalStatus, setFinalStatus] = useState('operational');
  const [nextMaintDate, setNextMaintDate] = useState('');
  const [observations, setObservations] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!type || !assetIdParam) {
      toast.error('Selecciona el tipo de mantenimiento');
      return;
    }
    try {
      const newMaintenance = await createMaintenance.mutateAsync({
        asset_id: Number(assetIdParam),
        technician_id: user?.id ?? 0,
        type: type as MaintenanceType,
        description,
        started_at: startedAt || null,
        finished_at: finishedAt || null,
        status: status as 'completed' | 'partial' | 'escalated',
        final_status: finalStatus,
        next_maintenance_date: nextMaintDate || null,
        observations,
      });

      // Subir archivos adjuntos si hay
      if (files.length > 0) {
        const maintenanceId = newMaintenance.id;
        for (let i = 0; i < files.length; i++) {
          toast.info(`Subiendo archivo ${i + 1} de ${files.length}: ${files[i].name}`);
          const formData = new FormData();
          formData.append('file', files[i]);
          try {
            await api.post(`/maintenances/${maintenanceId}/attachments`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          } catch {
            toast.error(`Error al subir: ${files[i].name}`);
          }
        }
      }

      toast.success('Mantenimiento registrado correctamente');
      router.push('/inventario/mantenimiento');
    } catch {
      toast.error('Error al registrar mantenimiento');
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-[var(--canvas)] border border-[var(--line)] rounded-xl text-sm outline-none focus:ring-2 focus:shadow-[var(--focus)] focus:border-[var(--selva-500)]";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <nav className="text-xs text-[var(--muted)] flex items-center gap-1 mb-1">
          <Link href="/inventario" className="hover:text-[var(--ink-2)]">Inventario</Link>
          <span className="text-[var(--faint)]">&rsaquo;</span>
          <Link href="/inventario/mantenimiento" className="hover:text-[var(--ink-2)]">Mantenimientos</Link>
          <span className="text-[var(--faint)]">&rsaquo;</span>
          <span className="text-[var(--ink-2)] font-medium">Registrar</span>
        </nav>
        <h1 className="text-2xl font-bold text-[var(--ink)]">Registrar Mantenimiento</h1>
      </div>

      {/* Asset Info */}
      {asset && (
        <div className="bg-[var(--surface)] rounded-xl border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-[var(--low-bg)] rounded-lg flex items-center justify-center">
            <Monitor className="w-5 h-5 text-[var(--selva-500)]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[var(--ink)]">{asset.name}</p>
            <p className="text-xs text-[var(--muted)]">Serial: {asset.serial}</p>
          </div>
          <div className="text-right text-xs text-[var(--muted)]">
            <p><strong>Sede:</strong> {asset.campus}</p>
            <p><strong>Cuentadante:</strong> {asset.holder?.name || '-'}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Type */}
          <div className="bg-[var(--surface)] rounded-xl border p-6">
            <h2 className="font-semibold text-[var(--ink)] mb-4">Tipo de Mantenimiento</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(typeConfig).map(([key, cfg]) => (
                <button key={key} onClick={() => setType(key as MaintenanceType)} className={`p-3 rounded-xl border-2 text-center transition-all ${type === key ? 'border-[var(--selva-500)] bg-[var(--low-bg)]' : 'border-[var(--line)] hover:border-[var(--line-2)]'}`}>
                  <cfg.icon className="w-5 h-5 text-[var(--selva-500)]" />
                  <p className="text-sm font-medium text-[var(--ink)] mt-1">{cfg.label}</p>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--ink-2)] mb-1.5">Descripción del trabajo</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Detalle las acciones realizadas..." className={inputClass + ' resize-none'} />
            </div>
          </div>

          {/* Dates */}
          <div className="bg-[var(--surface)] rounded-xl border p-6">
            <h2 className="font-semibold text-[var(--ink)] mb-4">Ejecución</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--ink-2)] mb-1.5">Fecha Inicio</label>
                <input type="date" value={startedAt} onChange={e => setStartedAt(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--ink-2)] mb-1.5">Fecha Fin</label>
                <input type="date" value={finishedAt} onChange={e => setFinishedAt(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--ink-2)] mb-1.5">Estado</label>
              <div className="flex gap-2">
                {[
                  { key: 'completed', label: 'Completado' },
                  { key: 'partial', label: 'Parcial' },
                  { key: 'escalated', label: 'Escalado' },
                ].map(s => (
                  <button key={s.key} onClick={() => setStatus(s.key)} className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${status === s.key ? 'border-[var(--selva-500)] bg-[var(--low-bg)] text-[var(--selva-500)]' : 'border-[var(--line)] hover:bg-[var(--surface-2)]'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Result */}
          <div className="bg-[var(--surface)] rounded-xl border p-6">
            <h2 className="font-semibold text-[var(--ink)] mb-4">Resultado Final</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--ink-2)] mb-1.5">Estado final del equipo</label>
                <select value={finalStatus} onChange={e => setFinalStatus(e.target.value)} className={inputClass}>
                  <option value="operational">Operativo</option>
                  <option value="damaged">Averiado</option>
                  <option value="decommissioned">Dado de Baja</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--ink-2)] mb-1.5">Proximo mantenimiento</label>
                <input type="date" value={nextMaintDate} onChange={e => setNextMaintDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--ink-2)] mb-1.5">Observaciones</label>
                <textarea value={observations} onChange={e => setObservations(e.target.value)} rows={3} placeholder="Notas adicionales..." className={inputClass + ' resize-none'} />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-[var(--surface)] rounded-xl border p-6">
            <h2 className="font-semibold text-[var(--ink)] mb-4">Adjuntos y Evidencia</h2>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-[var(--line-2)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--selva-500)] hover:bg-[var(--low-bg)] transition-all"
            >
              <p className="text-sm font-medium text-[var(--ink-2)]">Haz clic para seleccionar archivos</p>
              <p className="text-xs text-[var(--faint)] mt-1">PNG, JPG, PDF (Max. 10 MB por archivo)</p>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*,.pdf" onChange={e => { if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]); }} className="hidden" />
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-[var(--canvas)] rounded-lg px-3 py-2 text-sm">
                    <span className="text-[var(--ink-2)] truncate">{f.name}</span>
                    <button onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-[var(--crit)] hover:text-[var(--crit)] text-xs ml-2">Eliminar</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-6">
        <Link href="/inventario/mantenimiento" className="px-5 py-2.5 border rounded-xl text-sm font-medium hover:bg-[var(--surface-2)]">Cancelar</Link>
        <button onClick={handleSubmit} disabled={createMaintenance.isPending} className="bg-[var(--lima-500)] hover:bg-[var(--lima-400)] disabled:bg-[var(--surface-3)] text-[var(--lima-ink)] px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
          {createMaintenance.isPending ? 'Registrando...' : 'Registrar mantenimiento'}
        </button>
      </div>
    </div>
  );
}
