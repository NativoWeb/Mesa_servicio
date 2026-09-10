'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAssets, useUpdateAsset } from '@/hooks/use-assets';
import { useDashboard } from '@/hooks/use-dashboard';
import { ASSET_STATUS_CONFIG, CAMPUSES } from '@/lib/constants';
import { Asset, AssetStatus } from '@/types/asset';
import { toast } from 'sonner';

export default function InventarioDashboardPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [campusFilter, setCampusFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  const { data: dashboard } = useDashboard();
  const { data, isLoading } = useAssets({
    page,
    per_page: 25,
    ...(search && { search }),
    ...(categoryFilter && { category: categoryFilter }),
    ...(campusFilter && { campus: campusFilter }),
    ...(statusFilter && { status: statusFilter }),
  });

  const updateAsset = useUpdateAsset();

  const categories = ['pc', 'laptop', 'printer', 'server', 'router', 'switch', 'monitor', 'projector', 'other'];

  const currentPageIds = (data?.data || []).map((a: Asset) => a.id);
  const allSelected = currentPageIds.length > 0 && currentPageIds.every((id: number) => selectedIds.has(id));

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        currentPageIds.forEach((id: number) => next.delete(id));
      } else {
        currentPageIds.forEach((id: number) => next.add(id));
      }
      return next;
    });
  }, [allSelected, currentPageIds]);

  const handleBulkStatusChange = async (newStatus: AssetStatus) => {
    setBulkLoading(true);
    setBulkStatusOpen(false);
    const ids = Array.from(selectedIds);
    let successCount = 0;
    let errorCount = 0;

    for (const id of ids) {
      try {
        await updateAsset.mutateAsync({ id, status: newStatus });
        successCount++;
      } catch {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} activo(s) actualizado(s) a "${ASSET_STATUS_CONFIG[newStatus]?.label || newStatus}"`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} activo(s) no pudieron ser actualizados`);
    }

    setSelectedIds(new Set());
    setBulkLoading(false);
  };

  const handleExportSelected = () => {
    if (!data?.data) return;
    const selected = data.data.filter((a: Asset) => selectedIds.has(a.id));
    if (selected.length === 0) return;

    const headers = ['Codigo', 'Nombre', 'Categoria', 'Serial', 'Marca', 'Modelo', 'Sede', 'Estado', 'Cuentadante'];
    const rows = selected.map((a: Asset) => [
      a.asset_code,
      a.name,
      a.category,
      a.serial,
      a.brand,
      a.model,
      a.campus,
      ASSET_STATUS_CONFIG[a.status as keyof typeof ASSET_STATUS_CONFIG]?.label || a.status,
      a.holder?.name || '-',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activos_seleccionados_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${selected.length} activo(s) exportados a CSV`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario de Activos TI</h1>
          <p className="text-gray-500 text-sm">Gestion del parque tecnologico institucional</p>
        </div>
        <Link href="/inventario/nuevo" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          Registrar nuevo equipo
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Activos', value: dashboard?.assets.total ?? '-', color: 'text-gray-900' },
          { label: 'Operativos', value: dashboard?.assets.operational ?? '-', color: 'text-green-700' },
          { label: 'Averiados', value: dashboard?.assets.damaged ?? '-', color: 'text-red-600' },
          { label: 'Dados de Baja', value: dashboard?.assets.decommissioned ?? '-', color: 'text-yellow-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="px-3 py-2 bg-white border rounded-xl text-sm outline-none">
          <option value="">Todas las categorias</option>
          {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
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

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-green-800">
            {selectedIds.size} activo(s) seleccionado(s)
          </span>
          <div className="flex items-center gap-2">
            {/* Cambiar estado masivo */}
            <div className="relative">
              <button
                onClick={() => setBulkStatusOpen(!bulkStatusOpen)}
                disabled={bulkLoading}
                className="px-3 py-1.5 bg-white border border-green-300 rounded-lg text-sm font-medium text-green-800 hover:bg-green-100 disabled:opacity-50 transition-colors"
              >
                {bulkLoading ? 'Actualizando...' : 'Cambiar estado masivo'}
              </button>
              {bulkStatusOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 py-1 min-w-[180px]">
                  {Object.entries(ASSET_STATUS_CONFIG).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => handleBulkStatusChange(key as AssetStatus)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mr-2 ${val.color}`}>
                        {val.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Exportar seleccionados */}
            <button
              onClick={handleExportSelected}
              className="px-3 py-1.5 bg-white border border-green-300 rounded-lg text-sm font-medium text-green-800 hover:bg-green-100 transition-colors"
            >
              Exportar seleccionados
            </button>

            {/* Limpiar seleccion */}
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="p-3 pl-6 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Codigo</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Equipo</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Categoria</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Serial</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Sede</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Estado</th>
              <th className="text-left p-3 pr-6 font-medium text-gray-500 text-xs uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={8} className="p-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : !data?.data.length ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">No se encontraron activos</td></tr>
            ) : (
              data.data.map((a: Asset) => {
                const sCfg = ASSET_STATUS_CONFIG[a.status as keyof typeof ASSET_STATUS_CONFIG];
                return (
                  <tr key={a.id} className={`border-b hover:bg-gray-50/50 transition-colors ${selectedIds.has(a.id) ? 'bg-green-50/50' : ''}`}>
                    <td className="p-3 pl-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(a.id)}
                        onChange={() => toggleSelect(a.id)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="p-3 font-mono text-xs text-gray-500">{a.asset_code}</td>
                    <td className="p-3">
                      <p className="font-medium text-gray-900">{a.name}</p>
                      <p className="text-xs text-gray-500">{a.holder?.name || '-'}</p>
                    </td>
                    <td className="p-3 text-gray-600 capitalize">{a.category}</td>
                    <td className="p-3 font-mono text-xs text-gray-600">{a.serial}</td>
                    <td className="p-3 text-gray-600">{a.campus}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sCfg?.color || ''}`}>{sCfg?.label || a.status}</span>
                    </td>
                    <td className="p-3 pr-6">
                      <Link href={`/inventario/${a.id}`} className="text-green-700 hover:underline text-xs font-medium">Ver hoja de vida</Link>
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
