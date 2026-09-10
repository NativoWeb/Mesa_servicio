'use client';

import { useState } from 'react';

const reports = [
  { id: 'REP-01', title: 'Tickets por Técnico', desc: 'Desglose detallado de tickets por campo', formats: ['PDF', 'CSV'], icon: '🎫', color: 'bg-blue-50' },
  { id: 'REP-02', title: 'Activos por Sede', desc: 'Consolidado de inventario y software', formats: ['Excel'], icon: '💻', color: 'bg-green-50' },
  { id: 'REP-03', title: 'Cumplimiento SLA', desc: 'Porcentaje de tickets dentro del tiempo establecido', formats: ['PDF'], icon: '⏱️', color: 'bg-yellow-50' },
  { id: 'REP-04', title: 'Mantenimientos', desc: 'Historial de mantenimientos programados', formats: ['Excel', 'PDF'], icon: '🔧', color: 'bg-orange-50' },
];

const sampleData = [
  { name: 'Ing. Jaime Ortega', tickets: 62, resolution: '4h 15m', satisfaction: 4.5 },
  { name: 'Ing. María Fernanda Solar', tickets: 55, resolution: '4h 42m', satisfaction: 4.1 },
  { name: 'Téc. Carlos Ruiz', tickets: 31, resolution: '5h 0m', satisfaction: 4.8 },
];

const scheduled = [
  { name: 'Resumen Mensual de Tickets', freq: 'Cada Lunes 08:00 AM', dest: 'coord.ti@ejemplo.com, lider.tic@ejemplo.com', next: '01 Dic 2025, 08:00', status: 'active' },
  { name: 'Alerta de Inventario Crítico', freq: 'Día 1 de cada mes', dest: 'direccion@ejemplo.com, admin.activos@ejemplo.com', next: '01 Nov 2025, 08:15', status: 'paused' },
];

export default function AdminReportesPage() {
  const [activeReport, setActiveReport] = useState('REP-01');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Métricas</h1>
          <p className="text-gray-500 text-sm">Genera y descarga informes de la Mesa de Servicio e Inventario TI.</p>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((r) => (
          <div key={r.id} className={`rounded-xl border p-5 hover:shadow-sm transition-all cursor-pointer ${activeReport === r.id ? 'ring-2 ring-green-500 border-green-300' : 'bg-white'}`} onClick={() => setActiveReport(r.id)}>
            <div className={`w-10 h-10 ${r.color} rounded-lg flex items-center justify-center text-lg mb-3`}>{r.icon}</div>
            <p className="text-xs text-gray-500 font-medium">{r.id}</p>
            <h3 className="font-semibold text-gray-900 mt-0.5">{r.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{r.desc}</p>
            <div className="flex items-center gap-1.5 mt-3">
              {r.formats.map((f) => (
                <span key={f} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded font-medium uppercase">{f}</span>
              ))}
            </div>
            <button className="mt-3 text-sm text-green-700 font-medium hover:underline">Generar reporte →</button>
          </div>
        ))}
      </div>

      {/* Active Report Preview */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Configuración de Filtros — {activeReport}</h2>
          <span className="text-xs text-gray-400">Actualizado hace 2 min</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Rango de fechas</label>
            <input type="date" className="px-3 py-1.5 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sede</label>
            <select className="px-3 py-1.5 border rounded-lg text-sm">
              <option>Sede Central - Campus Principal</option>
              <option>Sede Norte</option>
              <option>Sede Sur</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Prioridades</label>
            <select className="px-3 py-1.5 border rounded-lg text-sm">
              <option>Todas las prioridades</option>
            </select>
          </div>
        </div>

        {/* Preview Table */}
        <div className="border rounded-xl overflow-hidden mb-4">
          <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-medium">Vista previa: 15 de 135 registros</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="text-left p-3 font-medium text-gray-500 text-xs">Técnico</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs">Tickets Asignados</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs">Resolución Promedio</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs">Satisfacción</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((d) => (
                <tr key={d.name} className="border-b">
                  <td className="p-3 font-medium text-gray-900">{d.name}</td>
                  <td className="p-3 text-gray-700">{d.tickets}</td>
                  <td className="p-3 text-gray-700">{d.resolution}</td>
                  <td className="p-3">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">★ {d.satisfaction}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-sm text-gray-600 hover:text-gray-800">Ver completo en pantalla</button>
          <button className="text-sm text-gray-600 hover:text-gray-800">Descargar CSV</button>
          <button className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-1.5 rounded-lg font-medium">Descargar PDF Final</button>
        </div>
      </div>

      {/* Report Activity (REP-05) */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-lg">👤</div>
          <div>
            <p className="text-xs text-gray-500 font-medium">REP-05 — Actividad Usuarios</p>
            <h3 className="font-semibold text-gray-900">Registro y procesamiento de logs y acciones</h3>
          </div>
        </div>
        <button className="text-sm text-green-700 font-medium hover:underline">Generar reporte →</button>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 uppercase text-sm tracking-wider">Reportes Programados</h2>
          <button className="border px-4 py-1.5 rounded-xl text-sm font-medium hover:bg-gray-50">+ Programar envío automático</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium text-gray-500 text-xs uppercase">Reporte</th>
              <th className="text-left py-2 font-medium text-gray-500 text-xs uppercase">Frecuencia</th>
              <th className="text-left py-2 font-medium text-gray-500 text-xs uppercase">Destinatarios</th>
              <th className="text-left py-2 font-medium text-gray-500 text-xs uppercase">Próximo envío</th>
              <th className="text-left py-2 font-medium text-gray-500 text-xs uppercase">Estado</th>
            </tr>
          </thead>
          <tbody>
            {scheduled.map((s) => (
              <tr key={s.name} className="border-b">
                <td className="py-3 font-medium text-gray-900">{s.name}</td>
                <td className="py-3 text-gray-600 text-xs">{s.freq}</td>
                <td className="py-3 text-gray-500 text-xs max-w-[200px] truncate">{s.dest}</td>
                <td className="py-3 text-gray-600 text-xs">{s.next}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {s.status === 'active' ? 'Activo' : 'Pausado'}
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
