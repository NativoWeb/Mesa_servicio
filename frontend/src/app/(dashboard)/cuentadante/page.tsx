'use client';

import Link from 'next/link';
import { useAssets } from '@/hooks/use-assets';
import { useDashboard } from '@/hooks/use-dashboard';
import { useAuthStore } from '@/stores/auth-store';
import { ASSET_STATUS_CONFIG } from '@/lib/constants';

export default function CuentadanteDashboardPage() {
  const user = useAuthStore(s => s.user);
  const { data: dashboard } = useDashboard();
  const { data, isLoading } = useAssets({
    holder_id: user?.id ?? 0,
    per_page: 50,
  });

  const equipos = data?.data || [];
  const myAssets = dashboard?.my_assets;

  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider">Dashboard Cuentadante</p>
      <h1 className="text-2xl font-bold text-gray-900">Hola, {user?.name || 'Cuentadante'}.</h1>
      <p className="text-gray-500 mb-6">Estos son los equipos bajo tu responsabilidad.</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Equipos a cargo', value: myAssets?.total ?? equipos.length },
          { label: 'Averiados', value: myAssets?.damaged ?? equipos.filter(e => e.status === 'damaged').length },
          { label: 'Mantenimientos este mes', value: myAssets?.maintenance_this_month ?? 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-6 flex items-start gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">{s.label}</p>
              <p className="text-3xl font-bold mt-1">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alert for damaged */}
      {equipos.some(e => e.status === 'damaged') && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-yellow-600 text-xl">&#9888;</span>
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">{equipos.filter(e => e.status === 'damaged').length} equipo(s)</span> con estado averiado.
            </p>
          </div>
        </div>
      )}

      {/* Tabla Inventario */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4 text-lg">Inventario de Equipos</h2>
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : equipos.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No tienes equipos asignados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-gray-500">Equipo</th>
                  <th className="pb-3 font-medium text-gray-500">Categoria</th>
                  <th className="pb-3 font-medium text-gray-500">Serial</th>
                  <th className="pb-3 font-medium text-gray-500">Sede</th>
                  <th className="pb-3 font-medium text-gray-500">Estado</th>
                  <th className="pb-3 font-medium text-gray-500">Accion</th>
                </tr>
              </thead>
              <tbody>
                {equipos.map((e, i) => {
                  const sCfg = ASSET_STATUS_CONFIG[e.status as keyof typeof ASSET_STATUS_CONFIG];
                  return (
                    <tr key={e.id} className={`border-b last:border-b-0 ${i % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                      <td className="py-3 font-medium text-gray-900">{e.name}</td>
                      <td className="py-3 text-gray-600 capitalize">{e.category}</td>
                      <td className="py-3 text-gray-600 font-mono text-xs">{e.serial}</td>
                      <td className="py-3 text-gray-600">{e.campus}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sCfg?.color || ''}`}>{sCfg?.label || e.status}</span>
                      </td>
                      <td className="py-3">
                        <Link href={`/cuentadante/equipos/${e.id}`} className="text-green-700 hover:text-green-900 text-xs font-medium hover:underline">
                          Ver hoja de vida
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
