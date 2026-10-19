'use client';

import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/use-users';
import { toast } from 'sonner';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  it_leader: 'Líder TIC',
  technician: 'Técnico',
  inventory_manager: 'Gestor Inventario',
  end_user: 'Usuario Final',
  asset_holder: 'Cuentadante',
};

export default function AdminUsuariosPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'end_user', campus: '', department: '' });
  const [editingUser, setEditingUser] = useState<{ id: number; name: string; email: string; role: string; campus: string; department: string; password: string } | null>(null);

  const { data, isLoading } = useUsers({ page, per_page: 15, ...(search && { search }), ...(roleFilter && { role: roleFilter }) });
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const emptyUser = { name: '', email: '', password: '', role: 'end_user', campus: '', department: '' };

  const handleCreate = async () => {
    if (!newUser.name.trim()) { toast.error('El nombre es obligatorio'); return; }
    if (!newUser.email.trim()) { toast.error('El email es obligatorio'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) { toast.error('Ingresa un email válido (ej: usuario@dominio.com)'); return; }
    if (!newUser.password) { toast.error('La contraseña es obligatoria'); return; }
    if (newUser.password.length < 8) { toast.error('La contraseña debe tener al menos 8 caracteres'); return; }
    try {
      await createUser.mutateAsync(newUser as any);
      toast.success('Usuario creado correctamente');
      setShowCreate(false);
      setNewUser(emptyUser);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.email?.[0] || 'Error al crear usuario';
      toast.error(msg);
    }
  };

  const handleCancel = () => {
    setShowCreate(!showCreate);
    if (showCreate) setNewUser(emptyUser);
    setEditingUser(null);
  };

  const handleEdit = (u: any) => {
    setEditingUser({ id: u.id, name: u.name, email: u.email, role: u.role, campus: u.campus || '', department: u.department || '', password: '' });
    setShowCreate(false);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    if (!editingUser.name.trim()) { toast.error('El nombre es obligatorio'); return; }
    if (!editingUser.email.trim()) { toast.error('El email es obligatorio'); return; }
    if (editingUser.password && editingUser.password.length < 8) { toast.error('La contraseña debe tener al menos 8 caracteres'); return; }
    try {
      const payload: any = {
        id: editingUser.id,
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        campus: editingUser.campus,
        department: editingUser.department,
      };
      if (editingUser.password) payload.password = editingUser.password;
      await updateUser.mutateAsync(payload);
      toast.success('Usuario actualizado correctamente');
      setEditingUser(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.email?.[0] || 'Error al actualizar usuario';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Eliminar usuario "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteUser.mutateAsync(id);
      toast.success(`Usuario "${name}" eliminado correctamente`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'No se puede eliminar: el usuario tiene tickets o activos asignados';
      toast.error(msg);
    }
  };

  const inputClass = "w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/20";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500">Administración centralizada de usuarios del sistema</p>
        </div>
        <button onClick={handleCancel} className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
          {showCreate ? 'Cancelar' : 'Crear usuario'}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="font-semibold mb-4">Nuevo Usuario</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
              <input value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
              <input type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
              <input type="password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} className={inputClass}>
                {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sede</label>
              <input value={newUser.campus} onChange={e => setNewUser(p => ({ ...p, campus: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <input value={newUser.department} onChange={e => setNewUser(p => ({ ...p, department: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <button onClick={handleCreate} disabled={createUser.isPending} className="bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg text-sm font-medium">
            {createUser.isPending ? 'Creando...' : 'Crear'}
          </button>
        </div>
      )}

      {/* Edit form */}
      {editingUser && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Editar Usuario</h2>
            <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600 text-sm">Cancelar</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
              <input value={editingUser.name} onChange={e => setEditingUser(p => p ? { ...p, name: e.target.value } : p)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
              <input type="email" value={editingUser.email} onChange={e => setEditingUser(p => p ? { ...p, email: e.target.value } : p)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input type="password" value={editingUser.password} onChange={e => setEditingUser(p => p ? { ...p, password: e.target.value } : p)} placeholder="Dejar vacío para no cambiar" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select value={editingUser.role} onChange={e => setEditingUser(p => p ? { ...p, role: e.target.value } : p)} className={inputClass}>
                {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sede</label>
              <input value={editingUser.campus} onChange={e => setEditingUser(p => p ? { ...p, campus: e.target.value } : p)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <input value={editingUser.department} onChange={e => setEditingUser(p => p ? { ...p, department: e.target.value } : p)} className={inputClass} />
            </div>
          </div>
          <button onClick={handleUpdate} disabled={updateUser.isPending} className="bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg text-sm font-medium">
            {updateUser.isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por nombre o email..." className="flex-1 max-w-xs px-4 py-2 bg-white border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/20" />
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} className="px-3 py-2 bg-white border rounded-lg text-sm outline-none">
          <option value="">Todos los roles</option>
          {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="text-left p-3 pl-6 font-medium text-gray-500 text-xs uppercase">Nombre</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Email</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Rol</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Sede</th>
              <th className="text-left p-3 pr-6 font-medium text-gray-500 text-xs uppercase">Acciones</th>
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
                  <td className="p-3 pl-6 font-medium text-gray-900">{u.name}</td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-700">{ROLE_LABELS[u.role] || u.role}</span>
                  </td>
                  <td className="p-3 text-gray-600">{u.campus || '-'}</td>
                  <td className="p-3 pr-6 flex items-center gap-3">
                    <button onClick={() => handleEdit(u)} className="text-green-700 hover:text-green-900 text-xs font-medium">Editar</button>
                    <button onClick={() => handleDelete(u.id, u.name)} className="text-red-600 hover:text-red-800 text-xs font-medium">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {data && data.last_page > 1 && (
          <div className="px-6 py-3 border-t flex items-center justify-between text-xs text-gray-500">
            <span>Página {data.current_page} de {data.last_page} ({data.total} usuarios)</span>
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
