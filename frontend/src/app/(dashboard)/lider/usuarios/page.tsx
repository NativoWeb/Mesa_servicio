'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/use-users';
import { useDashboard } from '@/hooks/use-dashboard';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  it_leader: 'Lider TIC',
  technician: 'Tecnico',
  inventory_manager: 'Gestor Inventario',
  end_user: 'Usuario Final',
  asset_holder: 'Cuentadante',
};

export default function UsuariosRolesPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data: dashboard } = useDashboard();
  const { data, isLoading } = useUsers({
    page,
    per_page: 15,
    ...(search && { search }),
    ...(roleFilter && { role: roleFilter }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios y Roles</h1>
          <p className="text-gray-500">Gestiona los usuarios de la Mesa de Servicio</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Usuarios', value: dashboard?.users.total ?? '-' },
          { label: 'Tickets Abiertos', value: dashboard?.tickets.open ?? '-' },
          { label: 'En Progreso', value: dashboard?.tickets.in_progress ?? '-' },
          { label: 'Cerrados', value: dashboard?.tickets.closed ?? '-' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border">
        <div className="p-4 flex flex-wrap items-center gap-3 border-b">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por nombre o email..."
            className="flex-1 max-w-xs px-4 py-2 bg-white border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/20"
          />
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border rounded-lg text-sm outline-none"
          >
            <option value="">Todos los roles</option>
            {Object.entries(ROLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="text-left p-3 pl-6 font-medium text-gray-500 text-xs uppercase">Nombre</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Email</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Rol</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Sede</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Departamento</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b"><td colSpan={5} className="p-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : !data?.data.length ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No se encontraron usuarios</td></tr>
              ) : (
                data.data.map(u => (
                  <tr key={u.id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-xs font-bold">
                          {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{u.email}</td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-700">
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{u.campus || '-'}</td>
                    <td className="p-3 text-gray-600">{u.department || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.last_page > 1 && (
          <div className="px-6 py-3 border-t flex items-center justify-between text-xs text-gray-500">
            <span>Pagina {data.current_page} de {data.last_page} ({data.total} usuarios)</span>
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
