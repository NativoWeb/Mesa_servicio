'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateMaintenance } from '@/hooks/use-maintenances';
import { useAsset } from '@/hooks/use-assets';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import type { MaintenanceType } from '@/types/maintenance';

const typeConfig: Record<string, { label: string; icon: string }> = {
  preventive: { label: 'Preventivo', icon: '🛡' },
  corrective: { label: 'Correctivo', icon: '🔧' },
  update: { label: 'Actualizacion', icon: '📦' },
  cleaning: { label: 'Limpieza', icon: '🧹' },
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

  const handleSubmit = async () => {
    if (!type || !assetIdParam) {
      toast.error('Selecciona el tipo de mantenimiento');
      return;
    }
    try {
      await createMaintenance.mutateAsync({
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
      toast.success('Mantenimiento registrado correctamente');
      router.push('/inventario/mantenimiento');
    } catch {
      toast.error('Error al registrar mantenimiento');
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <nav className="text-xs text-gray-500 flex items-center gap-1 mb-1">
          <Link href="/inventario" className="hover:text-gray-700">Inventario</Link>
          <span className="text-gray-300">&rsaquo;</span>
          <Link href="/inventario/mantenimiento" className="hover:text-gray-700">Mantenimientos</Link>
          <span className="text-gray-300">&rsaquo;</span>
          <span className="text-gray-700 font-medium">Registrar</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Registrar Mantenimiento</h1>
      </div>

      {/* Asset Info */}
      {asset && (
        <div className="bg-white rounded-xl border p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-lg">💻</div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{asset.name}</p>
            <p className="text-xs text-gray-500">Serial: {asset.serial}</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p><strong>Sede:</strong> {asset.campus}</p>
            <p><strong>Cuentadante:</strong> {asset.holder?.name || '-'}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Type */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Tipo de Mantenimiento</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(typeConfig).map(([key, cfg]) => (
                <button key={key} onClick={() => setType(key as MaintenanceType)} className={`p-3 rounded-xl border-2 text-center transition-all ${type === key ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="text-xl">{cfg.icon}</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">{cfg.label}</p>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripcion del trabajo</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Detalle las acciones realizadas..." className={inputClass + ' resize-none'} />
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Ejecucion</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha Inicio</label>
                <input type="date" value={startedAt} onChange={e => setStartedAt(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha Fin</label>
                <input type="date" value={finishedAt} onChange={e => setFinishedAt(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
              <div className="flex gap-2">
                {[
                  { key: 'completed', label: 'Completado' },
                  { key: 'partial', label: 'Parcial' },
                  { key: 'escalated', label: 'Escalado' },
                ].map(s => (
                  <button key={s.key} onClick={() => setStatus(s.key)} className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${status === s.key ? 'border-green-600 bg-green-50 text-green-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Result */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Resultado Final</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado final del equipo</label>
                <select value={finalStatus} onChange={e => setFinalStatus(e.target.value)} className={inputClass}>
                  <option value="operational">Operativo</option>
                  <option value="damaged">Averiado</option>
                  <option value="decommissioned">Dado de Baja</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Proximo mantenimiento</label>
                <input type="date" value={nextMaintDate} onChange={e => setNextMaintDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Observaciones</label>
                <textarea value={observations} onChange={e => setObservations(e.target.value)} rows={3} placeholder="Notas adicionales..." className={inputClass + ' resize-none'} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-6">
        <Link href="/inventario/mantenimiento" className="px-5 py-2.5 border rounded-xl text-sm font-medium hover:bg-gray-50">Cancelar</Link>
        <button onClick={handleSubmit} disabled={createMaintenance.isPending} className="bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
          {createMaintenance.isPending ? 'Registrando...' : 'Registrar mantenimiento'}
        </button>
      </div>
    </div>
  );
}
