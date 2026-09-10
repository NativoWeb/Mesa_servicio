'use client';

import { useState } from 'react';
import { useTicketsReport, useAssetsReport, useMaintenancesReport } from '@/hooks/use-reports';
import { STATUS_CONFIG, PRIORITY_CONFIG, ASSET_STATUS_CONFIG } from '@/lib/constants';

type ReportType = 'tickets' | 'assets' | 'maintenances';

const MAINT_TYPE_LABELS: Record<string, string> = {
  preventive: 'Preventivo',
  corrective: 'Correctivo',
  update: 'Actualizacion',
  cleaning: 'Limpieza',
};

export default function AdminReportesPage() {
  const [activeReport, setActiveReport] = useState<ReportType>('tickets');

  const { data: ticketsReport, isLoading: lt } = useTicketsReport();
  const { data: assetsReport, isLoading: la } = useAssetsReport();
  const { data: maintReport, isLoading: lm } = useMaintenancesReport();

  const reports = [
    { key: 'tickets' as const, title: 'Tickets por Estado y Prioridad' },
    { key: 'assets' as const, title: 'Activos por Estado y Categoria' },
    { key: 'maintenances' as const, title: 'Mantenimientos por Tipo' },
  ];

  const renderTable = (title: string, data: Record<string, number>, labelMap: Record<string, { label: string }>) => (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      {Object.keys(data).length === 0 ? (
        <p className="text-gray-400 text-center py-4">Sin datos</p>
      ) : (
        <div className="space-y-2">
          {Object.entries(data).map(([key, count]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <span className="text-sm text-gray-700">{labelMap[key]?.label || key}</span>
              <span className="text-sm font-bold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reportes y Metricas</h1>
        <p className="text-gray-500">Datos en tiempo real del sistema</p>
      </div>

      <div className="flex gap-2">
        {reports.map(r => (
          <button key={r.key} onClick={() => setActiveReport(r.key)}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${activeReport === r.key ? 'bg-green-50 border-green-300 text-green-800 font-medium' : 'hover:bg-gray-50'}`}>
            {r.title}
          </button>
        ))}
      </div>

      {activeReport === 'tickets' && (
        lt ? <div className="h-40 bg-gray-100 rounded-xl animate-pulse" /> : ticketsReport ? (
          <div className="space-y-6">
            <div className="bg-green-50 rounded-xl border border-green-200 p-6 text-center">
              <p className="text-xs text-green-600 uppercase">Total Tickets</p>
              <p className="text-4xl font-bold text-green-800">{ticketsReport.total}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderTable('Por Estado', ticketsReport.by_status, STATUS_CONFIG)}
              {ticketsReport.by_priority && renderTable('Por Prioridad', ticketsReport.by_priority, PRIORITY_CONFIG)}
            </div>
          </div>
        ) : null
      )}

      {activeReport === 'assets' && (
        la ? <div className="h-40 bg-gray-100 rounded-xl animate-pulse" /> : assetsReport ? (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 text-center">
              <p className="text-xs text-blue-600 uppercase">Total Activos</p>
              <p className="text-4xl font-bold text-blue-800">{assetsReport.total}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderTable('Por Estado', assetsReport.by_status, ASSET_STATUS_CONFIG)}
              {assetsReport.by_category && renderTable('Por Categoria', assetsReport.by_category,
                Object.fromEntries(Object.entries(assetsReport.by_category).map(([k]) => [k, { label: k.charAt(0).toUpperCase() + k.slice(1) }]))
              )}
            </div>
          </div>
        ) : null
      )}

      {activeReport === 'maintenances' && (
        lm ? <div className="h-40 bg-gray-100 rounded-xl animate-pulse" /> : maintReport ? (
          <div className="space-y-6">
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6 text-center">
              <p className="text-xs text-yellow-600 uppercase">Total Mantenimientos</p>
              <p className="text-4xl font-bold text-yellow-800">{maintReport.total}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {maintReport.by_type && renderTable('Por Tipo', maintReport.by_type, Object.fromEntries(Object.entries(MAINT_TYPE_LABELS).map(([k, v]) => [k, { label: v }])))}
              {maintReport.by_status && renderTable('Por Estado', maintReport.by_status, { completed: { label: 'Completado' }, partial: { label: 'Parcial' }, escalated: { label: 'Escalado' } })}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
