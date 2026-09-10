'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

type ConfigData = Record<string, string>;

const SMTP_KEYS = [
  { key: 'smtp_host', label: 'Host SMTP', placeholder: 'smtp.example.com' },
  { key: 'smtp_port', label: 'Puerto', placeholder: '587' },
  { key: 'smtp_username', label: 'Usuario', placeholder: 'user@example.com' },
  { key: 'smtp_password', label: 'Contrasena', placeholder: '********', type: 'password' },
  { key: 'smtp_from_address', label: 'Correo remitente', placeholder: 'noreply@example.com' },
  { key: 'smtp_from_name', label: 'Nombre remitente', placeholder: 'Mesa de Servicio TI' },
] as const;

const SMTP_ENCRYPTION_OPTIONS = ['tls', 'ssl'] as const;

const GENERAL_KEYS = [
  { key: 'app_name', label: 'Nombre de la aplicacion', placeholder: 'Mesa de Servicio TI' },
  { key: 'support_email', label: 'Correo de soporte', placeholder: 'soporte@uts.edu.co' },
] as const;

const CAMPUS_OPTIONS = [
  'Bucaramanga',
  'Piedecuesta',
  'Barrancabermeja',
  'Yopal',
  'Velez',
  'Charala',
];

type TabKey = 'general' | 'smtp' | 'backup';

export default function AdminConfigPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [form, setForm] = useState<ConfigData>({});
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['system-configs'],
    queryFn: async () => {
      const { data } = await api.get<{ data: ConfigData }>('/system-configs');
      return data.data;
    },
  });

  useEffect(() => {
    if (data) {
      setForm((prev) => ({ ...data, ...prev }));
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (configs: ConfigData) => {
      await api.put('/system-configs', { configs });
    },
    onSuccess: () => {
      toast.success('Configuracion actualizada correctamente.');
      queryClient.invalidateQueries({ queryKey: ['system-configs'] });
    },
    onError: () => {
      toast.error('Error al guardar la configuracion.');
    },
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    mutation.mutate(form);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'general', label: 'General' },
    { key: 'smtp', label: 'Correo SMTP' },
    { key: 'backup', label: 'Backup' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuracion del Sistema</h1>
          <p className="text-gray-500">Cargando configuracion...</p>
        </div>
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuracion del Sistema</h1>
        <p className="text-gray-500">Ajustes generales, correo SMTP y backup</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm rounded-t-lg border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-green-600 text-green-800 font-medium bg-green-50'
                : 'border-transparent hover:bg-gray-50 text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 mb-2">Configuracion General</h2>
          {GENERAL_KEYS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                value={form[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sede por defecto</label>
            <select
              value={form['default_campus'] || ''}
              onChange={(e) => handleChange('default_campus', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Seleccionar sede</option>
              {CAMPUS_OPTIONS.map((campus) => (
                <option key={campus} value={campus}>{campus}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* SMTP */}
      {activeTab === 'smtp' && (
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 mb-2">Configuracion SMTP</h2>
          <p className="text-sm text-gray-500 mb-4">
            Configure el servidor de correo para notificaciones y reportes programados.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SMTP_KEYS.map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type || 'text'}
                  value={form[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Encriptacion</label>
              <select
                value={form['smtp_encryption'] || 'tls'}
                onChange={(e) => handleChange('smtp_encryption', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {SMTP_ENCRYPTION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Backup */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 mb-2">Backup y Restauracion</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium mb-1">Informacion</p>
            <p className="text-sm text-blue-700">
              La configuracion de backups automaticos se gestiona a nivel de servidor.
              Contacte al administrador del sistema para programar backups de la base de datos PostgreSQL.
            </p>
          </div>
          <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-700">
              <strong>Base de datos:</strong> PostgreSQL 16+
            </p>
            <p className="text-sm text-gray-700">
              <strong>Estrategia recomendada:</strong> pg_dump diario con retencion de 30 dias
            </p>
            <p className="text-sm text-gray-700">
              <strong>Multitenancy:</strong> Cada tenant tiene su propio schema, los backups deben incluir todos los schemas
            </p>
          </div>
        </div>
      )}

      {/* Save button (not shown on backup tab) */}
      {activeTab !== 'backup' && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="px-6 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      )}
    </div>
  );
}
