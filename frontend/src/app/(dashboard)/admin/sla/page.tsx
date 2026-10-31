'use client';

import { useState, useEffect } from 'react';
import { useSlaConfigs, useUpdateSlaConfig, SlaConfig } from '@/hooks/use-sla-configs';
import { toast } from 'sonner';

const priorityLabels: Record<string, string> = {
  critical: 'Critica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

const priorityColors: Record<string, string> = {
  critical: 'bg-[var(--crit-bg)] text-[var(--crit)]',
  high: 'bg-[var(--high-bg)] text-[var(--high)]',
  medium: 'bg-[var(--med-bg)] text-[var(--med)]',
  low: 'bg-[var(--surface-3)] text-[var(--ink-2)]',
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
    const clamped = Math.max(1, value);
    setEditableRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: clamped } : row)));
  };

  const handleSave = async () => {
    if (!configs) return;

    for (const row of editableRows) {
      if (row.response_time_hours < 1 || row.resolution_time_hours < 1) {
        toast.error(`Los tiempos deben ser de al menos 1 hora (${priorityLabels[row.priority] || row.priority}).`);
        return;
      }
      if (row.response_time_hours >= row.resolution_time_hours) {
        toast.error(`El tiempo de respuesta debe ser menor al de resolución (${priorityLabels[row.priority] || row.priority}).`);
        return;
      }
    }

    setSaving(true);
    try {
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

      if (promises.length === 0) {
        toast.info('No hay cambios para guardar.');
        setEditing(false);
        setSaving(false);
        return;
      }

      await Promise.all(promises);
      toast.success('Tiempos SLA actualizados correctamente.');
      setEditing(false);
    } catch {
      toast.error('Error al guardar los tiempos SLA.');
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
            <h1 className="text-2xl font-bold text-[var(--ink)]">Configuracion de Tiempos SLA</h1>
            <p className="text-[var(--muted)] text-sm">Define los tiempos de respuesta y resolucion por prioridad</p>
          </div>
        </div>
        <div className="bg-[var(--surface)] rounded-xl border p-8 text-center text-[var(--muted)]">Cargando configuracion SLA...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)]">Configuracion de Tiempos SLA</h1>
            <p className="text-[var(--muted)] text-sm">Define los tiempos de respuesta y resolucion por prioridad</p>
          </div>
        </div>
        <div className="bg-[var(--surface)] rounded-xl border p-8 text-center text-[var(--crit)]">Error al cargar la configuracion SLA.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)]">Configuracion de Tiempos SLA</h1>
          <p className="text-[var(--muted)] text-sm">Define los tiempos de respuesta y resolucion por prioridad</p>
        </div>
        <button
          onClick={handleToggleEdit}
          disabled={saving}
          className="nw-btn primary disabled:opacity-50"
        >
          {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Editar parametros SLA'}
        </button>
      </div>

      <div className="nw-card overflow-hidden">
        <table className="nw-table">
          <thead>
            <tr>
              <th>Prioridad del Ticket</th>
              <th>Tiempo Respuesta (hrs)</th>
              <th>Tiempo Resolución (hrs)</th>
            </tr>
          </thead>
          <tbody>
            {editableRows.map((row, index) => (
              <tr key={row.id} className="border-b hover:bg-[var(--surface-2)]">
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[row.priority] || 'bg-[var(--surface-3)] text-[var(--ink-2)]'}`}>
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
                <td colSpan={3} className="p-8 text-center text-[var(--faint)]">
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
