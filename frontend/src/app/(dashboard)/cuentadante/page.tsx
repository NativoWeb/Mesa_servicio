'use client';

import Link from 'next/link';

const equipos = [
  { equipo: 'Laptop Dell Vostro', category: 'Portatiles', serial: 'SD-2024-091', campus: 'Sede Central', status: 'operational', nextMaint: '20/06/2025', statusLabel: 'Operativo' },
  { equipo: 'PC de Escritorio HP', category: 'Sobremesas', serial: 'SD-2024-042', campus: 'Sede Norte', status: 'damaged', nextMaint: '01/05/2025', statusLabel: 'Averiado' },
  { equipo: 'Impresora Kyocera', category: 'Perifericos', serial: 'SD-2023-098', campus: 'Sede Central', status: 'maintenance', nextMaint: '18/05/2025', statusLabel: 'Mantenimiento' },
  { equipo: 'MacBook Air M2', category: 'Portatiles', serial: 'SD-2023-122', campus: 'Sede Central', status: 'operational', nextMaint: '07/08/2025', statusLabel: 'Operativo' },
  { equipo: 'Camara Web Logitech', category: 'Perifericos', serial: 'SD-2024-099', campus: 'Sede Oeste', status: 'operational', nextMaint: '05/05/2026', statusLabel: 'Operativo' },
];

const statusColors: Record<string, string> = {
  operational: 'bg-green-100 text-green-800',
  damaged: 'bg-red-100 text-red-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
};

export default function CuentadanteDashboardPage() {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider">Dashboard Cuentadante</p>
      <h1 className="text-2xl font-bold text-gray-900">Hola, Cuentadante.</h1>
      <p className="text-gray-500 mb-6">Estos son los equipos bajo tu responsabilidad.</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Equipos a cargo', value: '15', icon: '🖥' },
          { label: 'Alertas activas', value: '2', icon: '🔔' },
          { label: 'Mantenimientos este mes', value: '3', icon: '🔧' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-6 flex items-start gap-4">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xs text-gray-500 uppercase">{s.label}</p>
              <p className="text-3xl font-bold mt-1">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Banner */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-yellow-600 text-xl">&#9888;</span>
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">1 equipo</span> tiene mantenimiento programado en los proximos 5 dias.
          </p>
        </div>
        <Link
          href="/cuentadante/equipos/1"
          className="text-sm font-medium text-yellow-800 bg-yellow-200 hover:bg-yellow-300 px-4 py-1.5 rounded-lg transition-colors"
        >
          Ver detalle
        </Link>
      </div>

      {/* Tabla Inventario de Equipos */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4 text-lg">Inventario de Equipos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-gray-500">Equipo</th>
                <th className="pb-3 font-medium text-gray-500">Categoria</th>
                <th className="pb-3 font-medium text-gray-500">Serial</th>
                <th className="pb-3 font-medium text-gray-500">Sede</th>
                <th className="pb-3 font-medium text-gray-500">Estado</th>
                <th className="pb-3 font-medium text-gray-500">Prox. Mant.</th>
                <th className="pb-3 font-medium text-gray-500">Accion</th>
              </tr>
            </thead>
            <tbody>
              {equipos.map((e, i) => (
                <tr key={e.serial} className={`border-b last:border-b-0 ${i % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                  <td className="py-3 font-medium text-gray-900">{e.equipo}</td>
                  <td className="py-3 text-gray-600">{e.category}</td>
                  <td className="py-3 text-gray-600 font-mono text-xs">{e.serial}</td>
                  <td className="py-3 text-gray-600">{e.campus}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[e.status]}`}>
                      {e.statusLabel}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{e.nextMaint}</td>
                  <td className="py-3">
                    <Link
                      href={`/cuentadante/equipos/${i + 1}`}
                      className="text-green-700 hover:text-green-900 text-xs font-medium hover:underline"
                    >
                      Ver hoja de vida
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
