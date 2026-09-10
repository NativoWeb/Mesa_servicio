'use client';

import { useState } from 'react';
import Link from 'next/link';

const assets = [
  { id: 'UTS-LPT-0442', name: 'MacBook Pro 14"', category: 'Laptops', serial: 'C02FM0Q02N', campus: 'Bucaramanga', location: 'Lab 302', status: 'operational' as const, nextMaint: '02 Nov 2023', holder: 'Julián Ortega' },
  { id: 'UTS-DSK-1299', name: 'Dell OptiPlex 7090', category: 'Desktops', serial: '3S-SMR2-Q98', campus: 'Bucaramanga', location: 'Admin', status: 'new' as const, nextMaint: '05 Ene 2024', holder: 'Ana Torres' },
  { id: 'UTS-SRV-0060', name: 'HP ProLiant DL380', category: 'Servidores', serial: 'CZ22034JN', campus: 'Bucaramanga', location: 'Datacenter Principal', status: 'damaged' as const, nextMaint: '20 Oct 2023', holder: 'Soporte TIC Central' },
  { id: 'UTS-IMP-0188', name: 'Xerox VersaLink C405', category: 'Impresoras', serial: 'XRK-0012-PNT', campus: 'Piedecuesta', location: 'Sala Profesores', status: 'operational' as const, nextMaint: '15 Dic 2023', holder: 'Laura Pineda' },
  { id: 'UTS-MON-0321', name: 'LG UltraWide 34"', category: 'Monitores', serial: 'LG-2024-UW34', campus: 'Barrancabermeja', location: 'Of. Decano', status: 'operational' as const, nextMaint: '10 Mar 2024', holder: 'Carlos Mejía' },
  { id: 'UTS-RTR-0015', name: 'Cisco Catalyst 9300', category: 'Redes', serial: 'FCW2345L0P8', campus: 'Bucaramanga', location: 'Rack 2 Piso 3', status: 'maintenance' as const, nextMaint: '01 Nov 2023', holder: 'Soporte TIC Central' },
];

const statusConfig = {
  new: { label: 'Nuevo', color: 'bg-blue-100 text-blue-700' },
  operational: { label: 'Operativo', color: 'bg-green-100 text-green-700' },
  damaged: { label: 'Averiado', color: 'bg-red-100 text-red-700' },
  maintenance: { label: 'Mantenimiento', color: 'bg-yellow-100 text-yellow-800' },
  decommissioned: { label: 'Dado de Baja', color: 'bg-gray-100 text-gray-600' },
};

export default function InventarioDashboardPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [campusFilter, setCampusFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = assets.filter((a) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.serial.toLowerCase().includes(search.toLowerCase()) && !a.holder.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && a.category !== categoryFilter) return false;
    if (campusFilter && a.campus !== campusFilter) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  const toggleSelect = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario de Activos TI</h1>
          <p className="text-gray-500 text-sm">Gestión del parque tecnológico institucional de las UTS</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="border px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">Importar CSV</button>
          <button className="border px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">Exportar</button>
          <Link href="/inventario/nuevo" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            Registrar nuevo equipo
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Activos', value: '1,248', icon: '💻', color: 'text-gray-900' },
          { label: 'Operativos', value: '1,150', icon: '✅', color: 'text-green-700' },
          { label: 'Averiados', value: '42', icon: '⚠️', color: 'text-red-600' },
          { label: 'Mantenimiento', value: '56', icon: '🔧', color: 'text-yellow-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
              <span>{s.icon}</span>
            </div>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-sm outline-none">
          <option value="">Todas las categorías</option>
          {['Laptops', 'Desktops', 'Servidores', 'Impresoras', 'Monitores', 'Redes'].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={campusFilter} onChange={(e) => setCampusFilter(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-sm outline-none">
          <option value="">Todas las sedes</option>
          {['Bucaramanga', 'Piedecuesta', 'Barrancabermeja', 'Yopal', 'Vélez'].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-sm outline-none">
          <option value="">Cualquier estado</option>
          {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Serial o Nombre del equipo..." className="flex-1 max-w-xs px-4 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20" />
        <div className="ml-auto flex gap-1">
          <button className="p-2 border rounded-lg hover:bg-gray-50 text-sm">☰</button>
          <button className="p-2 border rounded-lg hover:bg-gray-50 text-sm">⊞</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="w-10 p-3"><input type="checkbox" className="rounded" /></th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">ID Activo</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Equipo</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Categoría</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Serial</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Sede</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Estado</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Próx. Mant.</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50/50 transition-colors">
                <td className="p-3"><input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggleSelect(a.id)} className="rounded" /></td>
                <td className="p-3 font-mono text-xs text-gray-500">{a.id}</td>
                <td className="p-3">
                  <p className="font-medium text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.holder}</p>
                </td>
                <td className="p-3 text-gray-600">{a.category}</td>
                <td className="p-3 font-mono text-xs text-gray-600">{a.serial}</td>
                <td className="p-3 text-gray-600">{a.campus}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[a.status].color}`}>
                    {statusConfig[a.status].label}
                  </span>
                </td>
                <td className="p-3 text-gray-600 text-xs">{a.nextMaint}</td>
                <td className="p-3">
                  <Link href={`/inventario/${a.id}`} className="text-green-700 hover:underline text-xs font-medium">
                    Ver hoja de vida
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 border-t flex items-center justify-between text-xs text-gray-500">
          <span>Mostrando 1-{filtered.length} de 1248 activos</span>
          <span>25 por página</span>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border px-6 py-3 flex items-center gap-4 z-30">
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">{selected.length} Seleccionados</span>
          <button className="text-sm text-gray-700 hover:text-gray-900">Cambiar estado masivo</button>
          <button className="text-sm text-gray-700 hover:text-gray-900">Cambiar sede masiva</button>
          <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg font-medium">Exportar seleccionados</button>
          <button onClick={() => setSelected([])} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}
    </div>
  );
}
