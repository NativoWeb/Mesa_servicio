'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CAMPUSES } from '@/lib/constants';

export default function NuevoEquipoPage() {
  const [openSection, setOpenSection] = useState(1);
  const [serial, setSerial] = useState('');
  const [serialAvailable, setSerialAvailable] = useState<boolean | null>(null);

  const checkSerial = (value: string) => {
    setSerial(value);
    if (value.length > 5) setSerialAvailable(true);
    else setSerialAvailable(null);
  };

  const Section = ({ num, title, desc, children }: { num: number; title: string; desc: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border overflow-hidden">
      <button
        onClick={() => setOpenSection(openSection === num ? 0 : num)}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-gray-50/50 transition-colors"
      >
        <span className="w-7 h-7 bg-green-800 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">{num}</span>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 text-sm">{title}</h2>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
        <span className={`text-gray-400 transition-transform ${openSection === num ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {openSection === num && <div className="px-5 pb-5 pt-0 border-t">{children}</div>}
    </div>
  );

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-xs text-gray-500 flex items-center gap-1 mb-1">
            <Link href="/inventario" className="hover:text-gray-700">Inventario</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700 font-medium">Registrar nuevo equipo</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Registrar nuevo equipo</h1>
        </div>
        <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">Draft Mode</span>
      </div>

      <Section num={1} title="Identificación" desc="Datos básicos y seriales únicos del activo">
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del Equipo*</label>
              <input placeholder="Ej: Workstation Diseño 01" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría*</label>
              <select className={inputClass}>
                <option value="">Seleccionar</option>
                {['PC', 'Laptop', 'Impresora', 'Servidor', 'Router', 'Switch', 'Monitor', 'Proyector', 'Otro'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Marca*</label>
              <input placeholder="Apple, Dell, HP..." className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Modelo*</label>
              <input placeholder="Ej: MacBook Pro M2" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Serial*</label>
            <div className="relative">
              <input value={serial} onChange={(e) => checkSerial(e.target.value)} placeholder="UTS-2024-LAP-0014" className={inputClass} />
              {serialAvailable !== null && (
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium ${serialAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {serialAvailable ? '✓ Serial disponible' : '✕ Serial duplicado'}
                </span>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section num={2} title="Adquisición" desc="Información contable y de proveedor">
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Compra</label>
              <input type="date" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Valor de Compra</label>
              <input type="number" placeholder="$0" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Proveedor</label>
              <input placeholder="Nombre del proveedor" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Garantía hasta</label>
              <input type="date" className={inputClass} />
            </div>
          </div>
        </div>
      </Section>

      <Section num={3} title="Ubicación" desc="Sede y espacio físico asignado">
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sede*</label>
              <select className={inputClass}>
                <option value="">Seleccionar</option>
                {CAMPUSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Piso / Edificio</label>
              <input placeholder="Ej: Piso 3, Edificio A" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ubicación específica</label>
            <input placeholder="Ej: Lab. Informática 3, Puesto 12" className={inputClass} />
          </div>
        </div>
      </Section>

      <Section num={4} title="Responsabilidad" desc="Cuentadante y estado actual del activo">
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cuentadante*</label>
              <input placeholder="Buscar por nombre o correo..." className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado Inicial</label>
              <select className={inputClass}>
                <option>Nuevo</option>
                <option>Operativo</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      <Section num={5} title="Información adicional" desc="Notas y archivos adjuntos de respaldo">
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notas</label>
            <textarea rows={3} placeholder="Observaciones adicionales..." className={inputClass + ' resize-none'} />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 transition-colors">
            <p className="text-sm text-gray-500">Adjuntar acta de entrega, factura, etc.</p>
          </div>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex justify-end gap-3 pb-6">
        <Link href="/inventario" className="px-5 py-2.5 border rounded-xl text-sm font-medium hover:bg-gray-50">Cancelar</Link>
        <button className="bg-green-700 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
          Guardar equipo
        </button>
      </div>

      {/* Toast */}
      <div className="fixed bottom-6 right-6 bg-green-800 text-white px-4 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2 opacity-0 pointer-events-none">
        <span>✓</span> Activo registrado con código #A-00182
        <span className="text-green-300 text-xs ml-2 cursor-pointer">Ver hoja de vida · Cerrar</span>
      </div>
    </div>
  );
}
