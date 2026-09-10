'use client';

import { useState, useEffect } from 'react';
import { useSlaConfigs, useUpdateSlaConfig, SlaConfig } from '@/hooks/use-sla-configs';

const priorityLabels: Record<string, string> = {
  critical: 'Critica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

const priorityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-700',
};

interface EditableRow {
  id: number;
  priority: string;
  response_time_hours: number;
  resolution_time_hours: number;
}

export default function AdminSlaPage() {
  const [editing, setEditing] = useState(false);
  const [editableRows, setEditableRows] = useState<EditableRow[]>([]);
  const [saving, setSaving] = useState(false);

  const { data: configs, isLoading, error } = useSlaConfigs();
  const updateMutation = useUpdateSlaConfig();

  // Sincronizar datos del API con el estado editable
  useEffect(() => {
    if (configs) {
      setEditableRows(
        configs.map((c) => ({
          id: c.id,
          priority: c.priority,
          response_time_hours: c.response_time_hours,
          resolution_time_hours: c.resolution_time_hours,
        }))
      );
    }
  }, [configs]);

  const handleFieldChange = (index: number, field: 'response_time_hours' | 'resolution_time_hours', value: number) => {
    setEditableRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const handleSave = async () => {
    if (!configs) return;
    setSaving(true);
    try {
      // Solo actualizar las filas que cambiaron
      const promises = editableRows
        .filter((row) => {
          const original = configs.find((c) => c.id === row.id);
          return (
            original &&
            (original.response_time_hours !== row.response_time_hours ||
              original.resolution_time_hours !== row.resolution_time_hours)
          );
        })
        .map((row) =>
          updateMutation.mutateAsync({
            id: row.id,
            response_time_hours: row.response_time_hours,
            resolution_time_hours: row.resolution_time_hours,
          })
        );

      await Promise.all(promises);
      setEditing(false);
    } catch {
      // Error manejado por react-query
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEdit = () => {
    if (editing) {
      handleSave();
    } else {
      setEditing(true);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuracion de Tiempos SLA</h1>
            <p className="text-gray-500 text-sm">Define los tiempos de respuesta y resolucion por prioridad</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-8 text-center text-gray-500">Cargando configuracion SLA...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuracion de Tiempos SLA</h1>
            <p className="text-gray-500 text-sm">Define los tiempos de respuesta y resolucion por prioridad</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-8 text-center text-red-500">Error al cargar la configuracion SLA.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuracion de Tiempos SLA</h1>
          <p className="text-gray-500 text-sm">Define los tiempos de respuesta y resolucion por prioridad</p>
        </div>
        <button
          onClick={handleToggleEdit}
          disabled={saving}
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
        >
          {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Editar parametros SLA'}
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="text-left p-4 font-medium text-gray-500 text-xs uppercase">Prioridad del Ticket</th>
              <th className="text-left p-4 font-medium text-gray-500 text-xs uppercase">Tiempo Respuesta (hrs)</th>
              <th className="text-left p-4 font-medium text-gray-500 text-xs uppercase">Tiempo Resolucion (hrs)</th>
            </tr>
          </thead>
          <tbody>
            {editableRows.map((row, index) => (
              <tr key={row.id} className="border-b hover:bg-gray-50/50">
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[row.priority] || 'bg-gray-100 text-gray-700'}`}>
                    {priorityLabels[row.priority] || row.priority}
                  </span>
                </td>
                <td className="p-4">
                  {editing ? (
                    <input
                      type="number"
                      min={1}
                      value={row.response_time_hours}
                      onChange={(e) => handleFieldChange(index, 'response_time_hours', parseInt(e.target.value) || 1)}
                      className="w-20 px-2 py-1 border rounded-lg text-sm"
                    />
                  ) : (
                    <span>{row.response_time_hours} hrs</span>
                  )}
                </td>
                <td className="p-4">
                  {editing ? (
                    <input
                      type="number"
                      min={1}
                      value={row.resolution_time_hours}
                      onChange={(e) => handleFieldChange(index, 'resolution_time_hours', parseInt(e.target.value) || 1)}
                      className="w-20 px-2 py-1 border rounded-lg text-sm"
                    />
                  ) : (
                    <span>{row.resolution_time_hours} hrs</span>
                  )}
                </td>
              </tr>
            ))}
            {editableRows.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400">
                  No hay configuraciones SLA definidas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
