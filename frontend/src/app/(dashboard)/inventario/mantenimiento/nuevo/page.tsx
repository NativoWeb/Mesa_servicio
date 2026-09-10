'use client';

import { useState } from 'react';
import Link from 'next/link';

type MaintType = 'preventive' | 'corrective' | 'update' | 'cleaning' | null;

const typeConfig = {
  preventive: { label: 'Preventivo', icon: '🛡️' },
  corrective: { label: 'Correctivo', icon: '🔧' },
  update: { label: 'Actualización', icon: '📦' },
  cleaning: { label: 'Limpieza', icon: '🧹' },
};

export default function NuevoMantenimientoPage() {
  const [type, setType] = useState<MaintType>(null);
  const [status, setStatus] = useState('completed');
  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <nav className="text-xs text-gray-500 flex items-center gap-1 mb-1">
          <Link href="/inventario" className="hover:text-gray-700">Inventario</Link>
          <span className="text-gray-300">›</span>
          <Link href="/inventario/mantenimiento" className="hover:text-gray-700">Mantenimiento de activos</Link>
          <span className="text-gray-300">›</span>
          <span className="text-gray-700 font-medium">Registrar</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Registrar Mantenimiento</h1>
        <p className="text-gray-500 text-sm">Completa los detalles técnicos del servicio realizado al equipo.</p>
      </div>

      {/* Asset Info Card */}
      <div className="bg-white rounded-xl border p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-lg">💻</div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Laptop UTS-001</p>
          <p className="text-xs text-gray-500">Serial: DL-V1236765</p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <p><strong>Sede:</strong> Bucaramanga</p>
          <p><strong>Cuentadante:</strong> Andrés Mendoza</p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <p><strong>Último Mant.:</strong> 18/10/2023</p>
          <p><strong>Registrado:</strong> 20/04/2024</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Type */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-green-800 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Tipo de Mantenimiento
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(typeConfig) as [MaintType & string, { label: string; icon: string }][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setType(key as MaintType)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${type === key ? 'border-green-600 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <span className="text-xl">{cfg.icon}</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">{cfg.label}</p>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción del trabajo realizado</label>
              <textarea rows={4} placeholder="Detalle las acciones realizadas..." className={inputClass + ' resize-none'} />
            </div>
          </div>

          {/* Execution */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-green-800 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Ejecución y Responsable
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Técnico Responsable</label>
                <input defaultValue="Carlos Ruiz – Técnico Infraestructura" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Inicio</label>
                  <input type="date" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Finalización</label>
                  <input type="date" className={inputClass} />
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm text-green-800 flex items-center gap-2">
                <span>⏱️</span> Duración estimada del servicio: <strong>2 horas</strong>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado del Mantenimiento</label>
                <div className="flex gap-3">
                  {[
                    { key: 'completed', label: 'Completado', icon: '✅' },
                    { key: 'partial', label: 'Parcial', icon: '⏸️' },
                    { key: 'escalated', label: 'Escalado', icon: '🔺' },
                  ].map((s) => (
                    <label key={s.key} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${status === s.key ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="status" checked={status === s.key} onChange={() => setStatus(s.key)} className="sr-only" />
                      <span>{s.icon}</span>
                      <span className="text-sm font-medium">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Result */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-green-800 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Resultado Final
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado final del equipo</label>
                <select className={inputClass}>
                  <option>Operativo</option>
                  <option>Averiado</option>
                  <option>Dado de Baja</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Próximo mantenimiento (opcional)</label>
                <input type="date" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Observaciones</label>
                <textarea rows={3} placeholder="Notas adicionales..." className={inputClass + ' resize-none'} />
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-green-800 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
              Documentación
            </h2>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 transition-colors">
                <p className="text-sm font-medium text-gray-700">Informe Técnico (PDF)</p>
                <p className="text-xs text-gray-400 mt-1">Haz clic para subir el archivo</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 transition-colors">
                <p className="text-sm font-medium text-gray-700">Fotos del Equipo</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG (Máx. 10 MB)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pb-6">
        <Link href="/inventario/mantenimiento" className="px-5 py-2.5 border rounded-xl text-sm font-medium hover:bg-gray-50">Cancelar</Link>
        <button className="bg-green-700 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
          Registrar mantenimiento
        </button>
      </div>
    </div>
  );
}
