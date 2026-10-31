'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/use-users';
import { useDashboard } from '@/hooks/use-dashboard';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  it_leader: 'Líder TIC',
  technician: 'Técnico',
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
      <div className="page-head">
        <div>
          <h1>Usuarios y Roles</h1>
          <p>Gestiona los usuarios de la Mesa de Servicio</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Usuarios', value: dashboard?.users.total ?? '-' },
          { label: 'Tickets Abiertos', value: dashboard?.tickets.open ?? '-' },
          { label: 'En Progreso', value: dashboard?.tickets.in_progress ?? '-' },
          { label: 'Cerrados', value: dashboard?.tickets.closed ?? '-' },
        ].map((s) => (
          <div key={s.label} className="nw-card p-4">
            <p className="text-xs text-[var(--muted)] uppercase">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="nw-card">
        <div className="toolbar">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por nombre o email..."
            className="nw-input flex-1 max-w-xs"
          />
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="nw-input"
          >
            <option value="">Todos los roles</option>
            {Object.entries(ROLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="nw-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Sede</th>
                <th>Departamento</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b"><td colSpan={5} className="p-3"><div className="h-4 bg-[var(--surface-3)] rounded animate-pulse" /></td></tr>
                ))
              ) : !data?.data.length ? (
                <tr><td colSpan={5} className="text-center py-12 text-[var(--faint)]">No se encontraron usuarios</td></tr>
              ) : (
                data.data.map(u => (
                  <tr key={u.id} className="border-b hover:bg-[var(--surface-2)] transition-colors">
                    <td className="p-3 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--low-bg)] flex items-center justify-center text-[var(--selva-500)] text-xs font-bold">
                          {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-[var(--ink)]">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-[var(--ink-2)]">{u.email}</td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[var(--surface-3)] text-[var(--ink-2)]">
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td className="p-3 text-[var(--ink-2)]">{u.campus || '-'}</td>
                    <td className="p-3 text-[var(--ink-2)]">{u.department || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.last_page > 1 && (
          <div className="pager">
            <span>Página {data.current_page} de {data.last_page} ({data.total} usuarios)</span>
            <div className="pages">
              <button disabled={data.current_page <= 1} onClick={() => setPage(p => p - 1)}>‹</button>
              <button disabled={data.current_page >= data.last_page} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
