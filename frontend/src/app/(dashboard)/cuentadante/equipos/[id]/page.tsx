'use client';

import { use } from 'react';
import Link from 'next/link';

const timeline = [
  { date: '12/01/2024', title: 'Cambio de Cuentadante', desc: 'Asignacion formal al area de Coordinacion Academica', color: 'bg-blue-500' },
  { date: '03/09/2023', title: 'Mantenimiento Correctivo', desc: 'Limpieza fisica y optimizacion de software', color: 'bg-yellow-500' },
  { date: '07/03/2023', title: 'Cambio de Ubicacion', desc: 'Traslado de Sede Bucaramanga a Sede Piedecuesta', color: 'bg-purple-500' },
  { date: '10/01/2022', title: 'Ingreso a Inventario', desc: 'Compra inicial y registro en el sistema', color: 'bg-green-500' },
];

const docs = [
  { name: 'Acta_Asignacion.pdf', size: '245 KB' },
  { name: 'Reporte_Manto.pdf', size: '180 KB' },
  { name: 'Manual_Fabricante.pdf', size: '1.2 MB' },
];

const specs = [
  { label: 'Procesador', value: 'Intel Core i7 13th Gen' },
  { label: 'RAM', value: '16 GB DDR5' },
  { label: 'Almacenamiento', value: '512 GB SSD NVMe' },
  { label: 'SO', value: 'Windows 11 Pro' },
];

export default function HojaDeVidaEquipoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/cuentadante" className="hover:text-green-700 hover:underline">Dashboard</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Hoja de Vida - Equipo {id}</span>
      </div>

      {/* Banner Alerta */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6 flex items-center gap-3">
        <span className="text-yellow-600 text-xl">&#9888;</span>
        <div>
          <p className="text-sm font-semibold text-yellow-800">Mantenimiento Preventivo Pendiente</p>
          <p className="text-sm text-yellow-700">El equipo requiere revision programada para el 15/05/2025.</p>
        </div>
      </div>

      {/* Card Principal */}
      <div className="bg-white rounded-xl border p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
            💻
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Portatil UTS-001</h1>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Operativo
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Imprimir Ficha
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors">
            Solicitar Cambio
          </button>
        </div>
      </div>

      {/* Grid 2+1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Columna Izquierda - Informacion Tecnica */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4 text-lg">Informacion Tecnica</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Categoria', value: 'Portatiles' },
                { label: 'Modelo', value: 'Dell Vostro 3520' },
                { label: 'Serial', value: 'UTS-2024-091' },
                { label: 'Fecha Compra', value: '10/01/2022' },
                { label: 'Ubicacion', value: 'Sede Bucaramanga, Bloque A, Of. 301' },
                { label: 'Proveedor', value: 'Dell Technologies' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specs del Sistema */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="font-semibold mb-4 text-lg text-green-900">Specs del Sistema</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {specs.map((s) => (
                <div key={s.label} className="bg-white rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-700 uppercase tracking-wide">{s.label}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="space-y-6">
          {/* Estado & Responsabilidad */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Estado & Responsabilidad</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Cuentadante actual</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-sm font-bold text-green-800">
                    MR
                  </div>
                  <p className="text-sm font-medium text-gray-900">Marly Rangel</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Proximo Mantenimiento</p>
                <p className="text-sm font-medium text-gray-900 mt-1">15/05/2025</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Garantia UTS</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Vigente
                </span>
              </div>
            </div>
          </div>

          {/* Documentos Adjuntos */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Documentos Adjuntos</h2>
            <ul className="space-y-3">
              {docs.map((doc) => (
                <li key={doc.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 18h12a2 2 0 002-2V6l-4-4H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.size}</p>
                    </div>
                  </div>
                  <button className="text-green-700 hover:text-green-900 text-xs font-medium">
                    Descargar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Historial de Vida Util */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-6 text-lg">Historial de Vida Util</h2>
        <div className="relative">
          {/* Linea vertical */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {timeline.map((event, i) => (
              <div key={i} className="flex items-start gap-4 relative">
                {/* Dot */}
                <div className={`w-8 h-8 rounded-full ${event.color} flex items-center justify-center z-10 shrink-0`}>
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                {/* Content */}
                <div className="pb-2">
                  <p className="text-xs text-gray-500 font-mono">{event.date}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{event.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
