'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCreateAsset } from '@/hooks/use-assets';
import { useUsers } from '@/hooks/use-users';
import { CAMPUSES } from '@/lib/constants';
import { toast } from 'sonner';

export default function NuevoEquipoPage() {
  const router = useRouter();
  const createAsset = useCreateAsset();
  const { data: holdersData } = useUsers({ role: 'asset_holder', per_page: 100 });

  const [openSection, setOpenSection] = useState(1);
  const [form, setForm] = useState({
    name: '',
    category: '',
    brand: '',
    model: '',
    serial: '',
    purchase_date: '',
    warranty_expiry: '',
    campus: '',
    floor: '',
    location: '',
    holder_id: '',
    status: 'new',
    notes: '',
    specs: {} as Record<string, string>,
  });

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.brand || !form.model || !form.serial) {
      toast.error('Completa los campos obligatorios (nombre, categoria, marca, modelo, serial)');
      return;
    }
    try {
      await createAsset.mutateAsync({
        ...form,
        holder_id: form.holder_id ? Number(form.holder_id) : 0,
      });
      toast.success('Activo registrado correctamente');
      router.push('/inventario');
    } catch {
      toast.error('Error al registrar el activo');
    }
  };

  const Section = ({ num, title, desc, children }: { num: number; title: string; desc: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border overflow-hidden">
      <button onClick={() => setOpenSection(openSection === num ? 0 : num)} className="w-full flex items-center gap-3 p-5 text-left hover:bg-gray-50/50 transition-colors">
        <span className="w-7 h-7 bg-green-800 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">{num}</span>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 text-sm">{title}</h2>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
        <span className={`text-gray-400 transition-transform ${openSection === num ? 'rotate-180' : ''}`}>&#x25BE;</span>
      </button>
      {openSection === num && <div className="px-5 pb-5 pt-0 border-t">{children}</div>}
    </div>
  );

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <nav className="text-xs text-gray-500 flex items-center gap-1 mb-1">
          <Link href="/inventario" className="hover:text-gray-700">Inventario</Link>
          <span className="text-gray-300">&rsaquo;</span>
          <span className="text-gray-700 font-medium">Registrar nuevo equipo</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Registrar nuevo equipo</h1>
      </div>

      <Section num={1} title="Identificacion" desc="Datos basicos y seriales unicos del activo">
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del Equipo*</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej: Workstation Diseno 01" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria*</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inputClass}>
                <option value="">Seleccionar</option>
                {['pc', 'laptop', 'printer', 'server', 'router', 'switch', 'monitor', 'projector', 'other'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Marca*</label>
              <input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Apple, Dell, HP..." className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Modelo*</label>
              <input value={form.model} onChange={e => set('model', e.target.value)} placeholder="Ej: MacBook Pro M2" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Serial*</label>
            <input value={form.serial} onChange={e => set('serial', e.target.value)} placeholder="Ej: SN-2024-00412" className={inputClass} />
          </div>
        </div>
      </Section>

      <Section num={2} title="Adquisicion" desc="Informacion contable y de proveedor">
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Compra</label>
              <input type="date" value={form.purchase_date} onChange={e => set('purchase_date', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Garantia hasta</label>
              <input type="date" value={form.warranty_expiry} onChange={e => set('warranty_expiry', e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>
      </Section>

      <Section num={3} title="Ubicacion" desc="Sede y espacio fisico asignado">
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sede*</label>
              <select value={form.campus} onChange={e => set('campus', e.target.value)} className={inputClass}>
                <option value="">Seleccionar</option>
                {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Piso / Edificio</label>
              <input value={form.floor} onChange={e => set('floor', e.target.value)} placeholder="Ej: Piso 3, Edificio A" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ubicacion especifica</label>
            <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Ej: Lab. Informatica 3, Puesto 12" className={inputClass} />
          </div>
        </div>
      </Section>

      <Section num={4} title="Responsabilidad" desc="Cuentadante y estado actual del activo">
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cuentadante</label>
              <select value={form.holder_id} onChange={e => set('holder_id', e.target.value)} className={inputClass}>
                <option value="">Seleccionar</option>
                {holdersData?.data.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado Inicial</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className={inputClass}>
                <option value="new">Nuevo</option>
                <option value="operational">Operativo</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      <Section num={5} title="Informacion adicional" desc="Notas">
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notas</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Observaciones adicionales..." className={inputClass + ' resize-none'} />
          </div>
        </div>
      </Section>

      <div className="flex justify-end gap-3 pb-6">
        <Link href="/inventario" className="px-5 py-2.5 border rounded-xl text-sm font-medium hover:bg-gray-50">Cancelar</Link>
        <button
          onClick={handleSubmit}
          disabled={createAsset.isPending}
          className="bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          {createAsset.isPending ? 'Guardando...' : 'Guardar equipo'}
        </button>
      </div>
    </div>
  );
}
