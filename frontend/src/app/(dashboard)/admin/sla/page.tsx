'use client';

import { useState } from 'react';

const slaDefaults = [
  { priority: 'Crítica', response: 15, resolution: 60, escalation: 30 },
  { priority: 'Alta', response: 30, resolution: 240, escalation: 60 },
  { priority: 'Media', response: 60, resolution: 480, escalation: 120 },
  { priority: 'Baja', response: 120, resolution: 1440, escalation: 240 },
];

export default function AdminSlaPage() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración de Tiempos SLA</h1>
          <p className="text-gray-500 text-sm">Define los tiempos de respuesta y resolución por prioridad</p>
        </div>
        <button onClick={() => setEditing(!editing)} className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
          {editing ? 'Guardar cambios' : 'Editar parámetros SLA'}
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="text-left p-4 font-medium text-gray-500 text-xs uppercase">Prioridad del Ticket</th>
              <th className="text-left p-4 font-medium text-gray-500 text-xs uppercase">Tiempo Respuesta (min)</th>
              <th className="text-left p-4 font-medium text-gray-500 text-xs uppercase">Tiempo Resolución (min)</th>
              <th className="text-left p-4 font-medium text-gray-500 text-xs uppercase">Umbral Alerta (min)</th>
              <th className="text-left p-4 font-medium text-gray-500 text-xs uppercase">% Cumplimiento</th>
            </tr>
          </thead>
          <tbody>
            {slaDefaults.map((sla) => {
              const compliance = sla.priority === 'Crítica' ? 87 : sla.priority === 'Alta' ? 92 : sla.priority === 'Media' ? 96 : 99;
              const compColor = compliance >= 95 ? 'text-green-700 bg-green-100' : compliance >= 90 ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100';
              return (
                <tr key={sla.priority} className="border-b hover:bg-gray-50/50">
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      sla.priority === 'Crítica' ? 'bg-red-100 text-red-700' :
                      sla.priority === 'Alta' ? 'bg-orange-100 text-orange-700' :
                      sla.priority === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {sla.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    {editing ? <input type="number" defaultValue={sla.response} className="w-20 px-2 py-1 border rounded-lg text-sm" /> : <span>{sla.response} min</span>}
                  </td>
                  <td className="p-4">
                    {editing ? <input type="number" defaultValue={sla.resolution} className="w-20 px-2 py-1 border rounded-lg text-sm" /> : <span>{sla.resolution} min</span>}
                  </td>
                  <td className="p-4">
                    {editing ? <input type="number" defaultValue={sla.escalation} className="w-20 px-2 py-1 border rounded-lg text-sm" /> : <span>{sla.escalation} min</span>}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${compColor}`}>{compliance}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
