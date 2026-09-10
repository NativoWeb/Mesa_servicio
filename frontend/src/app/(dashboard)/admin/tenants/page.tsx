'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

interface TenantDomain {
  id: number;
  domain: string;
  tenant_id: string;
}

interface Tenant {
  id: string;
  data: {
    name?: string;
    plan?: string;
  };
  created_at: string;
  updated_at: string;
  domains: TenantDomain[];
}

const PLAN_LABELS: Record<string, string> = {
  basic: 'Basico',
  standard: 'Estandar',
  premium: 'Premium',
};

export default function AdminTenantsPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', domain: '', plan: 'basic' });

  const { data: tenants, isLoading } = useQuery<Tenant[]>({
    queryKey: ['tenants'],
    queryFn: async () => {
      const res = await api.get('/tenants');
      return res.data.data;
    },
  });

  const createTenant = useMutation({
    mutationFn: async (payload: typeof form) => {
      const res = await api.post('/tenants', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant creado exitosamente');
      setShowCreate(false);
      setForm({ id: '', name: '', domain: '', plan: 'basic' });
    },
    onError: () => {
      toast.error('Error al crear tenant');
    },
  });

  const deleteTenant = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tenants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar tenant');
    },
  });

  const handleCreate = () => {
    if (!form.id || !form.name || !form.domain) {
      toast.error('ID, nombre y dominio son obligatorios');
      return;
    }
    createTenant.mutate(form);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Eliminar tenant "${name || id}"? Se eliminara la base de datos asociada.`)) return;
    deleteTenant.mutate(id);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '-';
    }
  };

  const inputClass = 'w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/20';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants (Instituciones)</h1>
          <p className="text-gray-500">Gestion de instituciones registradas en el sistema multitenant</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
        >
          {showCreate ? 'Cancelar' : 'Crear Tenant'}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="font-semibold mb-4">Nuevo Tenant</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug)*</label>
              <input
                value={form.id}
                onChange={e => setForm(p => ({ ...p, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') }))}
                placeholder="uts-bucaramanga"
                className={inputClass}
              />
              <p className="text-[10px] text-gray-400 mt-1">Solo minusculas, numeros, guiones</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Unidades Tecnologicas de Santander"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dominio*</label>
              <input
                value={form.domain}
                onChange={e => setForm(p => ({ ...p, domain: e.target.value }))}
                placeholder="uts.servicedesk.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
              <select
                value={form.plan}
                onChange={e => setForm(p => ({ ...p, plan: e.target.value }))}
                className={inputClass}
              >
                {Object.entries(PLAN_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={createTenant.isPending}
            className="bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            {createTenant.isPending ? 'Creando...' : 'Crear'}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="text-left p-3 pl-6 font-medium text-gray-500 text-xs uppercase">ID</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Nombre</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Dominio</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Plan</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Creado</th>
              <th className="text-left p-3 pr-6 font-medium text-gray-500 text-xs uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b">
                  <td colSpan={6} className="p-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : !tenants?.length ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  No hay tenants registrados
                </td>
              </tr>
            ) : (
              tenants.map(tenant => (
                <tr key={tenant.id} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 pl-6 font-mono text-xs text-gray-700">{tenant.id}</td>
                  <td className="p-3 font-medium text-gray-900">{tenant.data?.name || '-'}</td>
                  <td className="p-3 text-gray-600">
                    {tenant.domains?.map(d => d.domain).join(', ') || '-'}
                  </td>
                  <td className="p-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
                      {PLAN_LABELS[tenant.data?.plan || 'basic'] || tenant.data?.plan || 'Basico'}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 text-xs">{formatDate(tenant.created_at)}</td>
                  <td className="p-3 pr-6">
                    <button
                      onClick={() => handleDelete(tenant.id, tenant.data?.name || tenant.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
