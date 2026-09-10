'use client';

import { useState } from 'react';
import Link from 'next/link';

type FilterStatus = 'all' | 'open' | 'in_progress' | 'pending' | 'closed';

const tickets = [
  { id: '#T-0042', category: 'Redes/Conectividad', title: 'Falla de internet en el aula 203', priority: 'high' as const, status: 'in_progress' as const, date: '24/05/2024', assignee: 'Andrés Gómez' },
  { id: '#T-0045', category: 'Hardware', title: 'Impresora no reconoce tóner', priority: 'medium' as const, status: 'open' as const, date: '23/05/2024', assignee: null },
  { id: '#T-0038', category: 'Software', title: 'Error al ingresar al correo institucional', priority: 'low' as const, status: 'closed' as const, date: '20/05/2024', assignee: 'Laura Martínez' },
  { id: '#T-0033', category: 'Accesos', title: 'Solicitud de acceso a plataforma Moodle', priority: 'medium' as const, status: 'pending' as const, date: '18/05/2024', assignee: 'Carlos Ruiz' },
  { id: '#T-0029', category: 'Hardware', title: 'Teclado defectuoso sala 204', priority: 'low' as const, status: 'closed' as const, date: '15/05/2024', assignee: 'Andrés Gómez' },
  { id: '#T-0025', category: 'Software', title: 'Instalación de MATLAB en laboratorio', priority: 'medium' as const, status: 'closed' as const, date: '10/05/2024', assignee: 'Diana Soler' },
];

const priorityConfig = {
  low: { label: 'Baja', color: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
  medium: { label: 'Media', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  high: { label: 'Alta', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  critical: { label: 'Crítica', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

const statusConfig = {
  open: { label: 'Abierto', color: 'bg-yellow-100 text-yellow-800' },
  in_progress: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
  pending: { label: 'Pendiente', color: 'bg-orange-100 text-orange-800' },
  closed: { label: 'Cerrado', color: 'bg-green-100 text-green-800' },
};

const filters: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'open', label: 'Abiertos' },
  { key: 'in_progress', label: 'En Progreso' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'closed', label: 'Cerrados' },
];

export default function MisTicketsPage() {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');

  const filtered = tickets.filter((t) => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id.includes(search)) return false;
    return true;
  });

  const activeCount = tickets.filter((t) => t.status !== 'closed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Tickets</h1>
          <p className="text-gray-500 text-sm">Tienes {activeCount} tickets activos</p>
        </div>
        <Link href="/usuario/tickets/nuevo" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5">
          <span className="text-lg leading-none">+</span> Crear nuevo ticket
        </Link>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-white rounded-xl border p-1 gap-0.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${filter === f.key ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-xs">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID o descripción..."
            className="w-full px-4 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <Link
            key={t.id}
            href={`/usuario/tickets/${t.id.replace('#T-', '')}`}
            className="bg-white rounded-xl border p-5 hover:shadow-md hover:border-green-200 transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-mono font-bold text-gray-900">{t.id}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${priorityConfig[t.priority].color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig[t.priority].dot}`} />
                {priorityConfig[t.priority].label}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t.category}</p>
            <h3 className="font-medium text-gray-900 mt-1 text-sm leading-snug group-hover:text-green-800 transition-colors">{t.title}</h3>
            <div className="flex items-center justify-between mt-4 pt-3 border-t">
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusConfig[t.status].color}`}>
                {statusConfig[t.status].label}
              </span>
              <span className="text-xs text-gray-400">{t.date}</span>
            </div>
            {t.assignee && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-[10px] font-bold">
                  {t.assignee.split(' ').map(n => n[0]).join('')}
                </div>
                {t.assignee}
                <span className="ml-auto text-green-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Ver detalle ›</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No se encontraron tickets</p>
          <p className="text-sm mt-1">Intenta con otro filtro o término de búsqueda</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Mostrando 1-{filtered.length} de {tickets.length} tickets</span>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50">‹</button>
          <button className="w-8 h-8 rounded-lg bg-green-700 text-white flex items-center justify-center font-medium">1</button>
          <button className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50">2</button>
          <button className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50">3</button>
          <button className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50">›</button>
        </div>
      </div>
    </div>
  );
}
