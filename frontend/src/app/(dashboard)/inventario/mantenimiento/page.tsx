'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMaintenances } from '@/hooks/use-maintenances';
import { format } from 'date-fns';

const TYPE_LABELS: Record<string, string> = {
  preventive: 'Preventivo',
  corrective: 'Correctivo',
  update: 'Actualizacion',
  cleaning: 'Limpieza',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  completed: { label: 'Completado', color: 'bg-[var(--low-bg)] text-[var(--selva-500)]' },
  partial: { label: 'Parcial', color: 'bg-[var(--med-bg)] text-[var(--med)]' },
  escalated: { label: 'Escalado', color: 'bg-[var(--crit-bg)] text-[var(--crit)]' },
};

export default function MantenimientosPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMaintenances({ page, per_page: 15 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)]">Mantenimientos</h1>
          <p className="text-[var(--muted)]">Historial y registro de mantenimientos</p>
        </div>
        <Link href="/inventario/mantenimiento/nuevo" className="bg-[var(--lima-500)] hover:bg-[var(--lima-400)] text-[var(--lima-ink)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Registrar mantenimiento
        </Link>
      </div>

      <div className="bg-[var(--surface)] rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-[var(--surface-2)]">
              <th className="text-left p-3 pl-6 font-semibold text-[var(--muted)] text-xs uppercase">ID</th>
              <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs uppercase">Activo</th>
              <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs uppercase">Tipo</th>
              <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs uppercase">Tecnico</th>
              <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs uppercase">Fecha</th>
              <th className="text-left p-3 font-semibold text-[var(--muted)] text-xs uppercase">Estado</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={6} className="p-3"><div className="h-4 bg-[var(--surface-3)] rounded animate-pulse" /></td></tr>
              ))
            ) : !data?.data.length ? (
              <tr><td colSpan={6} className="text-center py-12 text-[var(--faint)]">No hay mantenimientos registrados</td></tr>
            ) : (
              data.data.map(m => {
                const sLabel = m.status ? STATUS_LABELS[m.status] : null;
                return (
                  <tr key={m.id} className="border-b hover:bg-[var(--surface-2)] transition-colors">
                    <td className="p-3 pl-6 font-mono text-xs text-[var(--muted)]">#{m.id}</td>
                    <td className="p-3 text-[var(--ink)] font-medium">{m.asset?.name || `Activo #${m.asset_id}`}</td>
                    <td className="p-3 text-[var(--ink-2)]">{TYPE_LABELS[m.type] || m.type}</td>
                    <td className="p-3 text-[var(--ink-2)]">{m.technician?.name || '-'}</td>
                    <td className="p-3 text-[var(--ink-2)] text-xs">{m.started_at ? format(new Date(m.started_at), 'dd/MM/yyyy') : format(new Date(m.created_at), 'dd/MM/yyyy')}</td>
                    <td className="p-3">
                      {sLabel ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sLabel.color}`}>{sLabel.label}</span>
                      ) : (
                        <span className="text-xs text-[var(--faint)]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {data && data.last_page > 1 && (
          <div className="p-3 border-t flex items-center justify-between text-xs text-[var(--muted)]">
            <span>Pagina {data.current_page} de {data.last_page}</span>
            <div className="flex gap-1">
              <button disabled={data.current_page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border hover:bg-[var(--surface-2)] disabled:opacity-50">Anterior</button>
              <button disabled={data.current_page >= data.last_page} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border hover:bg-[var(--surface-2)] disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
