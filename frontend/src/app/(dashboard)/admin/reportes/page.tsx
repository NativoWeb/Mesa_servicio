'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTicketsReport, useAssetsReport, useMaintenancesReport } from '@/hooks/use-reports';
import { STATUS_CONFIG, PRIORITY_CONFIG, ASSET_STATUS_CONFIG } from '@/lib/constants';
import api from '@/lib/api';
import { toast } from 'sonner';

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

      {/* Reportes Programados */}
      <ScheduledReportsSection />
    </div>
  );
}

// ---------- Scheduled Reports Section ----------

interface ScheduledReportConfig {
  enabled: boolean;
  email: string;
}

const REPORT_TYPES = [
  { key: 'tickets', label: 'Tickets', description: 'Resumen diario de tickets por estado y prioridad' },
  { key: 'assets', label: 'Activos', description: 'Resumen diario de activos por estado y categoria' },
  { key: 'maintenances', label: 'Mantenimientos', description: 'Resumen diario de mantenimientos por tipo' },
] as const;

function ScheduledReportsSection() {
  const queryClient = useQueryClient();
  const [configs, setConfigs] = useState<Record<string, ScheduledReportConfig>>({
    tickets: { enabled: false, email: '' },
    assets: { enabled: false, email: '' },
    maintenances: { enabled: false, email: '' },
  });

  const { data: systemConfigs } = useQuery({
    queryKey: ['system-configs'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Record<string, string> }>('/system-configs');
      return data.data;
    },
  });

  useEffect(() => {
    if (systemConfigs) {
      const updated: Record<string, ScheduledReportConfig> = { ...configs };
      for (const type of REPORT_TYPES) {
        const raw = systemConfigs[`scheduled_report_${type.key}`];
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            updated[type.key] = { enabled: !!parsed.enabled, email: parsed.email || '' };
          } catch {
            // ignore parse errors
          }
        }
      }
      setConfigs(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemConfigs]);

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, string>) => {
      await api.put('/system-configs', { configs: payload });
    },
    onSuccess: () => {
      toast.success('Reportes programados actualizados.');
      queryClient.invalidateQueries({ queryKey: ['system-configs'] });
    },
    onError: () => {
      toast.error('Error al guardar los reportes programados.');
    },
  });

  const handleSave = () => {
    const payload: Record<string, string> = {};
    for (const type of REPORT_TYPES) {
      payload[`scheduled_report_${type.key}`] = JSON.stringify(configs[type.key]);
    }
    mutation.mutate(payload);
  };

  const updateConfig = (key: string, field: keyof ScheduledReportConfig, value: string | boolean) => {
    setConfigs((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  return (
    <div className="space-y-4 mt-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Reportes Programados</h2>
        <p className="text-gray-500 text-sm">Configure el envio automatico de reportes por correo electronico (diario a las 08:00).</p>
      </div>

      <div className="space-y-4">
        {REPORT_TYPES.map(({ key, label, description }) => (
          <div key={key} className="bg-white rounded-xl border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configs[key]?.enabled || false}
                      onChange={(e) => updateConfig(key, 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600" />
                  </label>
                  <span className="font-medium text-gray-900">Reporte de {label}</span>
                </div>
                <p className="text-sm text-gray-500 ml-12">{description}</p>
              </div>
            </div>
            {configs[key]?.enabled && (
              <div className="mt-3 ml-12">
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo destino</label>
                <input
                  type="email"
                  value={configs[key]?.email || ''}
                  onChange={(e) => updateConfig(key, 'email', e.target.value)}
                  placeholder="admin@uts.edu.co"
                  className="w-full max-w-md border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={mutation.isPending}
          className="px-6 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {mutation.isPending ? 'Guardando...' : 'Guardar reportes programados'}
        </button>
      </div>
    </div>
  );
}
