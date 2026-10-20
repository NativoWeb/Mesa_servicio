'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAssets } from '@/hooks/use-assets';
import { useMaintenances } from '@/hooks/use-maintenances';
import { useDashboard } from '@/hooks/use-dashboard';
import { ASSET_STATUS_CONFIG, CAMPUSES } from '@/lib/constants';
import { Wrench } from 'lucide-react';

export default function LiderInventarioPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-xl" />}>
      <LiderInventarioContent />
    </Suspense>
  );
}

const MAINTENANCE_TYPE_LABELS: Record<string, string> = {
  preventive: 'Preventivo',
  corrective: 'Correctivo',
  update: 'Actualizacion',
  cleaning: 'Limpieza',
};

const MAINTENANCE_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  completed: { label: 'Completado', color: 'bg-green-100 text-green-800' },
  partial: { label: 'Parcial', color: 'bg-yellow-100 text-yellow-800' },
  escalated: { label: 'Escalado', color: 'bg-red-100 text-red-800' },
};

function LiderInventarioContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || '';

  if (activeTab === 'maintenance') {
    return <MaintenanceView />;
  }

  return <AssetsView />;
}

function MaintenanceView() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMaintenances({ page, per_page: 15 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mantenimientos</h1>
          <p className="text-gray-500">Historial y seguimiento de mantenimientos de activos</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="text-left p-3 pl-6 font-medium text-gray-500 text-xs uppercase">ID</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Activo</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Tipo</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Fecha inicio</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Estado</th>
              <th className="text-left p-3 pr-6 font-medium text-gray-500 text-xs uppercase">Tecnico</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={6} className="p-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : !data?.data.length ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  <Wrench className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  No hay registros de mantenimiento
                </td>
              </tr>
            ) : (
              data.data.map((m) => {
                const mStatus = MAINTENANCE_STATUS_CONFIG[m.status || ''];
                return (
                  <tr key={m.id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 pl-6 font-mono text-xs text-gray-500">#{m.id}</td>
                    <td className="p-3">
                      <p className="font-medium text-gray-900">{m.asset?.name || `Activo #${m.asset_id}`}</p>
                      {m.asset?.asset_code && <p className="text-xs text-gray-500">{m.asset.asset_code}</p>}
                    </td>
                    <td className="p-3 text-gray-600">{MAINTENANCE_TYPE_LABELS[m.type] || m.type}</td>
                    <td className="p-3 text-gray-600 text-xs">
                      {m.started_at ? new Date(m.started_at).toLocaleDateString('es-CO') : 'Sin iniciar'}
                    </td>
                    <td className="p-3">
                      {mStatus ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${mStatus.color}`}>{mStatus.label}</span>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="p-3 pr-6 text-gray-600">{m.technician?.name || 'Sin asignar'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {data && data.last_page > 1 && (
          <div className="p-3 border-t flex items-center justify-between text-xs text-gray-500">
            <span>Pagina {data.current_page} de {data.last_page} ({data.total} registros)</span>
            <div className="flex gap-1">
              <button disabled={data.current_page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50">Anterior</button>
              <button disabled={data.current_page >= data.last_page} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AssetsView() {
  const [search, setSearch] = useState('');
  const [campusFilter, setCampusFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data: dashboard } = useDashboard();
  const { data, isLoading } = useAssets({
    page,
    per_page: 15,
    ...(search && { search }),
    ...(campusFilter && { campus: campusFilter }),
    ...(statusFilter && { status: statusFilter }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario de Activos TI</h1>
          <p className="text-gray-500">Consulta y gestiona los activos tecnologicos de todas las sedes</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: dashboard?.assets.total ?? '-', color: 'text-gray-900' },
          { label: 'Operativos', value: dashboard?.assets.operational ?? '-', color: 'text-green-700' },
          { label: 'Averiados', value: dashboard?.assets.damaged ?? '-', color: 'text-red-600' },
          { label: 'Dados de Baja', value: dashboard?.assets.decommissioned ?? '-', color: 'text-gray-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select value={campusFilter} onChange={e => { setCampusFilter(e.target.value); setPage(1); }} className="px-3 py-2 bg-white border rounded-xl text-sm outline-none">
          <option value="">Todas las sedes</option>
          {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 bg-white border rounded-xl text-sm outline-none">
          <option value="">Cualquier estado</option>
          {Object.entries(ASSET_STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por nombre o serial..." className="flex-1 max-w-xs px-4 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20" />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="text-left p-3 pl-6 font-medium text-gray-500 text-xs uppercase">Codigo</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Equipo</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Serial</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Sede</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Estado</th>
              <th className="text-left p-3 pr-6 font-medium text-gray-500 text-xs uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={6} className="p-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : !data?.data.length ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">No se encontraron activos</td></tr>
            ) : (
              data.data.map(a => {
                const sCfg = ASSET_STATUS_CONFIG[a.status as keyof typeof ASSET_STATUS_CONFIG];
                return (
                  <tr key={a.id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 pl-6 font-mono text-xs text-gray-500">{a.asset_code}</td>
                    <td className="p-3">
                      <p className="font-medium text-gray-900">{a.name}</p>
                      <p className="text-xs text-gray-500">{a.brand} {a.model}</p>
                    </td>
                    <td className="p-3 font-mono text-xs text-gray-600">{a.serial}</td>
                    <td className="p-3 text-gray-600">{a.campus}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sCfg?.color || ''}`}>{sCfg?.label || a.status}</span>
                    </td>
                    <td className="p-3 pr-6">
                      <Link href={`/inventario/${a.id}`} className="text-green-700 hover:underline text-xs font-medium">Ver detalle</Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {data && data.last_page > 1 && (
          <div className="p-3 border-t flex items-center justify-between text-xs text-gray-500">
            <span>Pagina {data.current_page} de {data.last_page} ({data.total} activos)</span>
            <div className="flex gap-1">
              <button disabled={data.current_page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50">Anterior</button>
              <button disabled={data.current_page >= data.last_page} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
