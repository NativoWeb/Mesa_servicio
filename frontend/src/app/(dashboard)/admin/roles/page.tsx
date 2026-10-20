'use client';

import { useState } from 'react';
import { useRoles, usePermissions, useCreateRole, useUpdateRole, useDeleteRole } from '@/hooks/use-roles';
import { Role, Permission } from '@/types/role';
import { PERMISSION_LABELS, PERMISSION_GROUP_LABELS } from '@/lib/constants';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Shield,
  Plus,
  Pencil,
  Trash2,
  Users,
  ChevronDown,
  ChevronRight,
  Loader2,
} from 'lucide-react';

const ROLE_BADGE_COLORS = [
  'bg-red-100 text-red-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-yellow-100 text-yellow-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
];

function getPermissionLabel(name: string): string {
  return PERMISSION_LABELS[name] || name.split('.').pop()?.replace(/_/g, ' ') || name;
}

export default function AdminRolesPage() {
  const { data: roles, isLoading } = useRoles();
  const { data: groupedPermissions } = usePermissions();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPermissions, setFormPermissions] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const openCreate = () => {
    setEditingRole(null);
    setFormName('');
    setFormDescription('');
    setFormPermissions([]);
    if (groupedPermissions) {
      setExpandedGroups(new Set(Object.keys(groupedPermissions)));
    }
    setShowFormDialog(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setFormName(role.name);
    setFormDescription(role.description || '');
    setFormPermissions(role.permissions.map(p => p.name));
    if (groupedPermissions) {
      setExpandedGroups(new Set(Object.keys(groupedPermissions)));
    }
    setShowFormDialog(true);
  };

  const openDelete = (role: Role) => {
    setDeletingRole(role);
    setShowDeleteDialog(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast.error('El nombre del rol es obligatorio');
      return;
    }
    try {
      const payload = {
        name: formName.trim(),
        description: formDescription.trim(),
        permissions: formPermissions,
      };
      if (editingRole) {
        await updateRole.mutateAsync({ id: editingRole.id, ...payload });
        toast.success('Rol actualizado correctamente');
      } else {
        await createRole.mutateAsync(payload);
        toast.success('Rol creado correctamente');
      }
      setShowFormDialog(false);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr?.response?.data?.message
        || (editingRole ? 'Error al actualizar el rol' : 'Error al crear el rol');
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (!deletingRole) return;
    try {
      await deleteRole.mutateAsync(deletingRole.id);
      toast.success(`Rol "${deletingRole.name}" eliminado correctamente`);
      setShowDeleteDialog(false);
      setDeletingRole(null);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosErr?.response?.status;
      if (status === 409) {
        toast.error('No se puede eliminar: hay usuarios asignados a este rol');
      } else if (status === 403) {
        toast.error('No se puede eliminar un rol del sistema');
      } else {
        toast.error(axiosErr?.response?.data?.message || 'Error al eliminar el rol');
      }
    }
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const togglePermission = (permName: string) => {
    setFormPermissions(prev =>
      prev.includes(permName)
        ? prev.filter(p => p !== permName)
        : [...prev, permName]
    );
  };

  const toggleGroupAll = (group: string, permissions: Permission[]) => {
    const permNames = permissions.map(p => p.name);
    const allSelected = permNames.every(n => formPermissions.includes(n));
    if (allSelected) {
      setFormPermissions(prev => prev.filter(p => !permNames.includes(p)));
    } else {
      setFormPermissions(prev => [...new Set([...prev, ...permNames])]);
    }
  };

  const isSaving = createRole.isPending || updateRole.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuracion de Roles y Permisos</h1>
          <p className="text-gray-500 text-sm">Gestiona los roles del sistema y sus permisos</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Crear Rol
        </button>
      </div>

      {/* Role cards */}
      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-5">
              <div className="space-y-3">
                <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-6 w-20 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : !roles?.length ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay roles configurados</p>
          </div>
        ) : (
          roles.map((role, idx) => (
            <div key={role.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE_COLORS[idx % ROLE_BADGE_COLORS.length]}`}>
                      {role.name}
                    </span>
                    {role.is_system && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-200 text-gray-600">
                        Sistema
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{role.description || 'Sin descripcion'}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span className="flex items-center gap-1 text-xs text-gray-500" title="Usuarios asignados">
                    <Users className="w-3.5 h-3.5" />
                    {role.users_count}
                  </span>
                  <button
                    onClick={() => openEdit(role)}
                    className="p-1.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    title="Editar rol"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {!role.is_system && (
                    <button
                      onClick={() => openDelete(role)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar rol"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.map(perm => (
                  <span
                    key={perm.id}
                    className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-medium"
                  >
                    {getPermissionLabel(perm.name)}
                  </span>
                ))}
                {role.permissions.length === 0 && (
                  <span className="text-xs text-gray-400 italic">Sin permisos asignados</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Editar Rol' : 'Crear Rol'}</DialogTitle>
            <DialogDescription>
              {editingRole
                ? 'Modifica el nombre, descripcion y permisos del rol.'
                : 'Define un nuevo rol con sus permisos asociados.'}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del rol *
              </label>
              <input
                value={formName}
                onChange={e => setFormName(e.target.value)}
                disabled={editingRole?.is_system}
                placeholder="Ej: Supervisor de soporte"
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/20 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripcion
              </label>
              <textarea
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                rows={2}
                placeholder="Describe las responsabilidades de este rol..."
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permisos
              </label>
              {!groupedPermissions ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cargando permisos...
                </div>
              ) : Object.keys(groupedPermissions).length === 0 ? (
                <p className="text-sm text-gray-400 py-4">No hay permisos disponibles</p>
              ) : (
                <div className="space-y-1 border rounded-lg p-3">
                  {Object.entries(groupedPermissions).map(([group, perms]) => {
                    const isExpanded = expandedGroups.has(group);
                    const groupLabel = PERMISSION_GROUP_LABELS[group] || group;
                    const allSelected = perms.length > 0 && perms.every(p => formPermissions.includes(p.name));
                    const selectedCount = perms.filter(p => formPermissions.includes(p.name)).length;

                    return (
                      <div key={group} className="border-b last:border-b-0 pb-2 last:pb-0">
                        <div className="flex items-center gap-2 py-1">
                          <button
                            type="button"
                            onClick={() => toggleGroup(group)}
                            className="text-gray-500 hover:text-gray-700 shrink-0"
                          >
                            {isExpanded
                              ? <ChevronDown className="w-4 h-4" />
                              : <ChevronRight className="w-4 h-4" />}
                          </button>
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={() => toggleGroupAll(group, perms)}
                            aria-label={`Seleccionar todos: ${groupLabel}`}
                          />
                          <button
                            type="button"
                            onClick={() => toggleGroup(group)}
                            className="text-sm font-medium text-gray-800 hover:text-gray-900 select-none"
                          >
                            {groupLabel}
                            <span className="ml-1 text-xs text-gray-400 font-normal">
                              ({selectedCount}/{perms.length})
                            </span>
                          </button>
                        </div>
                        {isExpanded && (
                          <div className="ml-10 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 py-1.5">
                            {perms.map(perm => {
                              const isChecked = formPermissions.includes(perm.name);
                              return (
                                <div key={perm.id} className="flex items-center gap-2">
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={() => togglePermission(perm.name)}
                                    aria-label={getPermissionLabel(perm.name)}
                                  />
                                  <span
                                    className="text-sm text-gray-600 cursor-pointer select-none"
                                    onClick={() => togglePermission(perm.name)}
                                  >
                                    {getPermissionLabel(perm.name)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </DialogClose>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1B5E20] hover:bg-[#2E7D32] rounded-lg disabled:bg-gray-300 transition-colors"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingRole ? 'Guardar cambios' : 'Crear rol'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar rol</DialogTitle>
            <DialogDescription>
              ¿Eliminar rol &quot;{deletingRole?.name}&quot;? Esta accion no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </DialogClose>
            <button
              onClick={handleDelete}
              disabled={deleteRole.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:bg-gray-300 transition-colors"
            >
              {deleteRole.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Eliminar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
