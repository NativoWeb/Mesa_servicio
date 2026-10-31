'use client';

import { use } from 'react';
import Link from 'next/link';
import { Laptop, Monitor, Printer } from 'lucide-react';
import { useAsset } from '@/hooks/use-assets';
import { useMaintenances } from '@/hooks/use-maintenances';
import { ASSET_STATUS_CONFIG } from '@/lib/constants';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const MAINT_TYPE_LABELS: Record<string, string> = {
  preventive: 'Preventivo',
  corrective: 'Correctivo',
  update: 'Actualización',
  cleaning: 'Limpieza',
};

export default function DetalleActivoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const assetId = Number(id);
  const { data: asset, isLoading } = useAsset(assetId);
  const { data: maintenancesData } = useMaintenances({ asset_id: assetId, per_page: 20 });

  if (isLoading || !asset) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-[var(--line)] rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-[var(--surface-3)] rounded-xl animate-pulse" />
          <div className="h-64 bg-[var(--surface-3)] rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const sCfg = ASSET_STATUS_CONFIG[asset.status as keyof typeof ASSET_STATUS_CONFIG];
  const maintenances = maintenancesData?.data || [];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-4">
        <Link href="/inventario" className="hover:text-[var(--selva-500)] hover:underline">Inventario</Link>
        <span>/</span>
        <span className="text-[var(--ink)] font-medium">{asset.asset_code}</span>
      </div>

      {/* Header Card */}
      <div className="bg-[var(--surface)] rounded-xl border p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--low-bg)] rounded-lg flex items-center justify-center">
            {asset.category === 'laptop' ? <Laptop className="w-6 h-6 text-[var(--selva-500)]" /> : asset.category === 'server' ? <Monitor className="w-6 h-6 text-[var(--selva-500)]" /> : asset.category === 'printer' ? <Printer className="w-6 h-6 text-[var(--selva-500)]" /> : <Laptop className="w-6 h-6 text-[var(--selva-500)]" />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--ink)]">{asset.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs text-[var(--muted)]">{asset.asset_code}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${sCfg?.color || ''}`}>{sCfg?.label || asset.status}</span>
            </div>
          </div>
        </div>
        <Link href={`/inventario/mantenimiento/nuevo?asset_id=${asset.id}`} className="bg-[var(--lima-500)] hover:bg-[var(--lima-400)] text-[var(--lima-ink)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Registrar Mantenimiento
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Technical Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--surface)] rounded-xl border p-6">
            <h2 className="font-semibold mb-4 text-lg">Información Técnica</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Categoría', value: asset.category },
                { label: 'Marca', value: asset.brand },
                { label: 'Modelo', value: asset.model },
                { label: 'Serial', value: asset.serial },
                { label: 'Sede', value: asset.campus },
                { label: 'Ubicación', value: `${asset.floor || ''} ${asset.location || ''}`.trim() || '-' },
                { label: 'Fecha Compra', value: asset.purchase_date ? format(new Date(asset.purchase_date), 'dd/MM/yyyy') : '-' },
                { label: 'Garantía', value: asset.warranty_expiry ? format(new Date(asset.warranty_expiry), 'dd/MM/yyyy') : 'Sin garantía' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-medium text-[var(--ink)] mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specs */}
          {asset.specs && Object.keys(asset.specs).length > 0 && (
            <div className="bg-[var(--low-bg)] border border-[var(--line)] rounded-xl p-6">
              <h2 className="font-semibold mb-4 text-lg text-[var(--selva-500)]">Especificaciones</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(asset.specs).map(([key, value]) => (
                  <div key={key} className="bg-[var(--surface)] rounded-lg p-3 border border-[var(--line)]">
                    <p className="text-xs text-[var(--selva-500)] uppercase tracking-wide">{key}</p>
                    <p className="text-sm font-semibold text-[var(--ink)] mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance History */}
          <div className="bg-[var(--surface)] rounded-xl border p-6">
            <h2 className="font-semibold mb-4 text-lg">Historial de Mantenimientos</h2>
            {maintenances.length === 0 ? (
              <p className="text-[var(--faint)] text-center py-8">No hay mantenimientos registrados</p>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-[var(--line)]" />
                <div className="space-y-6">
                  {maintenances.map(m => (
                    <div key={m.id} className="flex items-start gap-4 relative">
                      <div className="w-8 h-8 rounded-full bg-[var(--med)] flex items-center justify-center z-10 shrink-0">
                        <div className="w-3 h-3 bg-[var(--surface)] rounded-full" />
                      </div>
                      <div className="pb-2">
                        <p className="text-xs text-[var(--muted)] font-mono">{m.started_at ? format(new Date(m.started_at), 'dd/MM/yyyy') : format(new Date(m.created_at), 'dd/MM/yyyy')}</p>
                        <p className="text-sm font-semibold text-[var(--ink)] mt-0.5">{MAINT_TYPE_LABELS[m.type] || m.type}</p>
                        <p className="text-sm text-[var(--ink-2)] mt-0.5">{m.description || m.observations || 'Sin descripción'}</p>
                        {m.technician && <p className="text-xs text-[var(--faint)] mt-1">Técnico: {m.technician.name}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-[var(--surface)] rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Responsabilidad</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Cuentadante</p>
                {asset.holder ? (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-8 h-8 bg-[var(--low-bg)] rounded-full flex items-center justify-center text-sm font-bold text-[var(--selva-500)]">
                      {asset.holder.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <p className="text-sm font-medium text-[var(--ink)]">{asset.holder.name}</p>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--faint)] mt-1">Sin asignar</p>
                )}
              </div>
              {asset.next_maintenance && (
                <div>
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Próximo Mantenimiento</p>
                  <p className="text-sm font-medium text-[var(--ink)] mt-1">{format(new Date(asset.next_maintenance), 'dd/MM/yyyy')}</p>
                </div>
              )}
              {asset.warranty_expiry && (
                <div>
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Garantía</p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${new Date(asset.warranty_expiry) > new Date() ? 'bg-[var(--low-bg)] text-[var(--selva-500)]' : 'bg-[var(--crit-bg)] text-[var(--crit)]'}`}>
                    {new Date(asset.warranty_expiry) > new Date() ? 'Vigente' : 'Vencida'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {asset.notes && (
            <div className="bg-[var(--surface)] rounded-xl border p-6">
              <h2 className="font-semibold mb-2">Notas</h2>
              <p className="text-sm text-[var(--ink-2)]">{asset.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
