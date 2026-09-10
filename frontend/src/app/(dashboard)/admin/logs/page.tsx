'use client';

import { useState } from 'react';

const logs = [
  { timestamp: '09/09/2026 14:23:01', user: 'admin_central', action: 'update_SLA', target: 'Prioridad Alta: 240→180 min', ip: '192.168.1.50', status: 'success' as const },
  { timestamp: '09/09/2026 13:15:44', user: 'm_gonzalez_ti', action: 'assign_ticket', target: 'Ticket #T-4592 → Técnico A. Gómez', ip: '192.168.1.102', status: 'success' as const },
  { timestamp: '09/09/2026 12:40:22', user: 'admin_central', action: 'backup_manual', target: 'Backup completo BD mesa_ayuda', ip: '192.168.1.50', status: 'success' as const },
  { timestamp: '09/09/2026 11:05:18', user: 'j_perez_user', action: 'login_failed', target: 'Intento acceso módulo admin', ip: '10.0.0.34', status: 'blocked' as const },
  { timestamp: '09/09/2026 10:30:00', user: 'admin_central', action: 'create_user', target: 'Nuevo usuario: Sandra Rodríguez (Técnico)', ip: '192.168.1.50', status: 'success' as const },
  { timestamp: '09/09/2026 09:12:33', user: 'm_rueda_inv', action: 'delete_asset', target: 'Activo UTS-DSK-0088 dado de baja', ip: '192.168.1.78', status: 'success' as const },
];

const statusConfig = {
  success: { label: 'Éxito', color: 'bg-green-100 text-green-700' },
  blocked: { label: 'Bloqueado', color: 'bg-red-100 text-red-700' },
  warning: { label: 'Advertencia', color: 'bg-yellow-100 text-yellow-700' },
};

export default function AdminLogsPage() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const filtered = logs.filter((l) => {
    if (search && !l.user.includes(search) && !l.target.toLowerCase().includes(search.toLowerCase())) return false;
    if (actionFilter && l.action !== actionFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logs de Auditoría</h1>
          <p className="text-gray-500 text-sm">Registro detallado de todas las acciones administrativas críticas del sistema</p>
        </div>
        <div className="flex gap-2">
          <button className="border px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">CSV</button>
          <button className="border px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">PDF</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filtrar por usuario..." className="flex-1 max-w-xs px-4 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20" />
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-sm outline-none">
          <option value="">Todas las acciones</option>
          <option value="login_failed">Login fallido</option>
          <option value="update_SLA">Actualización SLA</option>
          <option value="assign_ticket">Asignación ticket</option>
          <option value="backup_manual">Backup</option>
          <option value="create_user">Crear usuario</option>
          <option value="delete_asset">Eliminar activo</option>
        </select>
        <input type="date" className="px-3 py-2 bg-white border rounded-xl text-sm outline-none" />
        <button className="text-sm text-gray-500 hover:text-gray-700">Resetear ↺</button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Timestamp</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Usuario</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Acción</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Detalle</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">IP</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => (
              <tr key={i} className="border-b hover:bg-gray-50/50 transition-colors">
                <td className="p-3 font-mono text-xs text-gray-500">{l.timestamp}</td>
                <td className="p-3 font-mono text-xs font-medium text-gray-900">{l.user}</td>
                <td className="p-3">
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-700">{l.action}</span>
                </td>
                <td className="p-3 text-gray-700 max-w-xs truncate">{l.target}</td>
                <td className="p-3 font-mono text-xs text-gray-500">{l.ip}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[l.status].color}`}>
                    {statusConfig[l.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
