'use client';

import { useState, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTickets, useUpdateTicket } from '@/hooks/use-tickets';
import { useUsers } from '@/hooks/use-users';
import { useShifts, useCreateShift, useUpdateShift, useDeleteShift } from '@/hooks/use-shifts';
import { PRIORITY_CONFIG, CAMPUSES } from '@/lib/constants';
import { Shift } from '@/types/shift';
import { formatDistanceToNow, format, startOfWeek, addDays, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  MapPin,
  Ticket,
} from 'lucide-react';

export default function AsignacionPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-[var(--surface-3)] rounded-xl" />}>
      <AsignacionContent />
    </Suspense>
  );
}

const TABS = [
  { key: '', label: 'Asignar Tickets', icon: Users },
  { key: 'calendar', label: 'Calendario de Turnos', icon: Calendar },
  { key: 'workload', label: 'Carga por Tecnico', icon: TrendingUp },
] as const;

const SHIFT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Programado', color: 'bg-[var(--info-bg)] text-[var(--info)]' },
  active: { label: 'Activo', color: 'bg-[var(--low-bg)] text-[var(--selva-500)]' },
  completed: { label: 'Completado', color: 'bg-[var(--surface-3)] text-[var(--ink-2)]' },
};

function AsignacionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || '';

  const handleTabChange = (tab: string) => {
    if (tab) {
      router.push(`/lider/asignacion?tab=${tab}`);
    } else {
      router.push('/lider/asignacion');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="tabs">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={activeTab === key ? 'on' : ''}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'calendar' ? (
        <CalendarView />
      ) : activeTab === 'workload' ? (
        <WorkloadView />
      ) : (
        <AssignmentView />
      )}
    </div>
  );
}

// ─── Tab 1: Asignacion de Tickets ────────────────────────────────────────

function AssignmentView() {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  const { data: ticketsData, isLoading: loadingTickets } = useTickets({
    status: 'open',
    per_page: 50,
  });

  const { data: techsData, isLoading: loadingTechs } = useUsers({ role: 'technician', per_page: 50 });

  const updateTicket = useUpdateTicket();

  const unassigned = ticketsData?.data.filter(t => !t.assigned_to) || [];

  const handleAssign = async (ticketId: number, techId: number) => {
    try {
      await updateTicket.mutateAsync({ id: ticketId, assigned_to: techId, status: 'in_progress' });
      toast.success('Ticket asignado correctamente');
      setSelectedTicket(null);
    } catch {
      toast.error('Error al asignar el ticket');
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Asignacion de Tickets</h1>
          <p>Asigna tickets a tecnicos disponibles</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets sin asignar */}
        <div className="nw-card card-pad">
          <h2 className="font-semibold mb-4">Tickets pendientes de asignacion ({unassigned.length})</h2>
          {loadingTickets ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-[var(--surface-3)] rounded-lg animate-pulse" />)}</div>
          ) : unassigned.length === 0 ? (
            <p className="text-[var(--faint)] text-center py-8">No hay tickets sin asignar</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {unassigned.map(t => {
                const pCfg = PRIORITY_CONFIG[t.priority as keyof typeof PRIORITY_CONFIG];
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedTicket === t.id ? 'border-[var(--selva-500)] bg-[var(--low-bg)]' : 'hover:bg-[var(--surface-2)]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[var(--muted)]">#{t.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pCfg?.color || ''}`}>{pCfg?.label || t.priority}</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--ink)] mt-1 truncate">{t.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[var(--muted)]">
                      <span>{t.requester?.name}</span>
                      <span>&middot;</span>
                      <span>{t.campus}</span>
                      <span>&middot;</span>
                      <span>{formatDistanceToNow(new Date(t.created_at), { locale: es, addSuffix: true })}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tecnicos */}
        <div className="nw-card card-pad">
          <h2 className="font-semibold mb-4">Tecnicos disponibles</h2>
          {loadingTechs ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-[var(--surface-3)] rounded-lg animate-pulse" />)}</div>
          ) : !techsData?.data.length ? (
            <p className="text-[var(--faint)] text-center py-8">No hay tecnicos registrados</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {techsData.data.map(tech => (
                <div key={tech.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-[var(--surface-2)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--low-bg)] flex items-center justify-center text-[var(--selva-500)] text-xs font-bold">
                      {tech.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--ink)]">{tech.name}</p>
                      <p className="text-xs text-[var(--muted)]">{tech.campus || 'Sin sede'}</p>
                    </div>
                  </div>
                  <button
                    disabled={!selectedTicket || updateTicket.isPending}
                    onClick={() => selectedTicket && handleAssign(selectedTicket, tech.id)}
                    className="nw-btn primary text-xs px-3 py-1.5 disabled:bg-[var(--surface-3)] disabled:cursor-not-allowed"
                  >
                    {updateTicket.isPending ? 'Asignando...' : 'Asignar'}
                  </button>
                </div>
              ))}
            </div>
          )}
          {!selectedTicket && techsData?.data.length ? (
            <p className="text-xs text-[var(--faint)] mt-3 text-center">Selecciona un ticket a la izquierda primero</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: Calendario de Turnos ─────────────────────────────────────────

function CalendarView() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [showShiftDialog, setShowShiftDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  const weekStart = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const dateFrom = format(weekDays[0], 'yyyy-MM-dd');
  const dateTo = format(weekDays[6], 'yyyy-MM-dd');

  const { data: techsData, isLoading: loadingTechs } = useUsers({ role: 'technician', per_page: 50 });
  const { data: shiftsData, isLoading: loadingShifts } = useShifts({
    date_from: dateFrom,
    date_to: dateTo,
    per_page: 200,
  });

  const createShift = useCreateShift();
  const updateShift = useUpdateShift();
  const deleteShift = useDeleteShift();

  const technicians = techsData?.data || [];
  const shifts = shiftsData?.data;

  const shiftsByTechAndDay = useMemo(() => {
    const map = new Map<string, Shift[]>();
    if (shifts) {
      for (const shift of shifts) {
        const key = `${shift.technician_id}-${shift.date}`;
        const existing = map.get(key) || [];
        existing.push(shift);
        map.set(key, existing);
      }
    }
    return map;
  }, [shifts]);

  // Form state
  const [formTechId, setFormTechId] = useState<number | ''>('');
  const [formDate, setFormDate] = useState('');
  const [formStartTime, setFormStartTime] = useState('08:00');
  const [formEndTime, setFormEndTime] = useState('17:00');
  const [formCampus, setFormCampus] = useState('');
  const [formBuilding, setFormBuilding] = useState('');
  const [formStatus, setFormStatus] = useState('scheduled');

  const resetForm = () => {
    setFormTechId('');
    setFormDate('');
    setFormStartTime('08:00');
    setFormEndTime('17:00');
    setFormCampus('');
    setFormBuilding('');
    setFormStatus('scheduled');
  };

  const openCreate = (techId?: number, date?: string) => {
    setEditingShift(null);
    resetForm();
    if (techId) setFormTechId(techId);
    if (date) setFormDate(date);
    setShowShiftDialog(true);
  };

  const openEdit = (shift: Shift) => {
    setEditingShift(shift);
    setFormTechId(shift.technician_id);
    setFormDate(shift.date);
    setFormStartTime(shift.start_time?.slice(0, 5) || '08:00');
    setFormEndTime(shift.end_time?.slice(0, 5) || '17:00');
    setFormCampus(shift.campus || '');
    setFormBuilding(shift.building || '');
    setFormStatus(shift.status);
    setShowShiftDialog(true);
  };

  const handleSave = async () => {
    if (!formTechId || !formDate || !formStartTime || !formEndTime) {
      toast.error('Completa los campos obligatorios: tecnico, fecha, hora inicio y hora fin');
      return;
    }
    if (formStartTime >= formEndTime) {
      toast.error('La hora de inicio debe ser anterior a la hora fin');
      return;
    }

    try {
      const payload = {
        technician_id: Number(formTechId),
        date: formDate,
        start_time: formStartTime,
        end_time: formEndTime,
        campus: formCampus || undefined,
        building: formBuilding || undefined,
        status: formStatus as Shift['status'],
      };

      if (editingShift) {
        await updateShift.mutateAsync({ id: editingShift.id, ...payload });
        toast.success('Turno actualizado correctamente');
      } else {
        await createShift.mutateAsync(payload);
        toast.success('Turno creado correctamente');
      }
      setShowShiftDialog(false);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr?.response?.data?.message || 'Error al guardar el turno');
    }
  };

  const confirmDelete = () => {
    if (!editingShift) return;
    setShowShiftDialog(false);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!editingShift) return;
    try {
      await deleteShift.mutateAsync(editingShift.id);
      toast.success('Turno eliminado correctamente');
      setShowDeleteDialog(false);
      setEditingShift(null);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr?.response?.data?.message || 'Error al eliminar el turno');
    }
  };

  const isSaving = createShift.isPending || updateShift.isPending;
  const isLoading = loadingTechs || loadingShifts;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)]">Calendario de Turnos</h1>
          <p className="text-[var(--muted)] text-sm">Gestiona los turnos semanales de los tecnicos</p>
        </div>
        <button
          onClick={() => openCreate()}
          className="nw-btn primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Crear turno
        </button>
      </div>

      {/* Week selector */}
      <div className="flex items-center justify-between nw-card p-3">
        <button
          onClick={() => setWeekOffset(w => w - 1)}
          className="p-1.5 rounded-lg hover:bg-[var(--surface-3)] transition-colors text-[var(--ink-2)]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--ink)]">
            {format(weekDays[0], "d 'de' MMMM", { locale: es })} — {format(weekDays[6], "d 'de' MMMM, yyyy", { locale: es })}
          </span>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="text-xs text-[var(--selva-500)] hover:text-[var(--selva-500)] font-medium"
            >
              Hoy
            </button>
          )}
        </div>
        <button
          onClick={() => setWeekOffset(w => w + 1)}
          className="p-1.5 rounded-lg hover:bg-[var(--surface-3)] transition-colors text-[var(--ink-2)]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar grid */}
      {isLoading ? (
        <div className="nw-card p-8">
          <div className="flex items-center justify-center gap-2 text-[var(--faint)]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando calendario...</span>
          </div>
        </div>
      ) : technicians.length === 0 ? (
        <div className="nw-card p-12 text-center">
          <Users className="w-10 h-10 text-[var(--faint)] mx-auto mb-2" />
          <p className="text-[var(--muted)]">No hay tecnicos registrados</p>
        </div>
      ) : (
        <div className="nw-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[var(--surface-2)]">
                  <th className="text-left p-3 pl-4 font-semibold text-[var(--muted)] text-xs uppercase sticky left-0 bg-[var(--surface-2)] min-w-[160px]">
                    Tecnico
                  </th>
                  {weekDays.map(day => {
                    const today = isToday(day);
                    return (
                      <th
                        key={day.toISOString()}
                        className={`text-center p-3 font-medium text-xs uppercase min-w-[140px] ${
                          today ? 'bg-[var(--low-bg)] text-[var(--selva-500)]' : 'text-[var(--muted)]'
                        }`}
                      >
                        <div>{format(day, 'EEE', { locale: es })}</div>
                        <div className={`text-base font-semibold ${today ? 'text-[var(--selva-500)]' : 'text-[var(--ink)]'}`}>
                          {format(day, 'd')}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {technicians.map(tech => (
                  <tr key={tech.id} className="border-b last:border-b-0 hover:bg-[var(--surface-2)]">
                    <td className="p-3 pl-4 sticky left-0 bg-[var(--surface)]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[var(--low-bg)] flex items-center justify-center text-[var(--selva-500)] text-[10px] font-bold shrink-0">
                          {tech.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--ink)] truncate">{tech.name}</p>
                          <p className="text-[10px] text-[var(--muted)] truncate">{tech.campus || 'Sin sede'}</p>
                        </div>
                      </div>
                    </td>
                    {weekDays.map(day => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const dayShifts = shiftsByTechAndDay.get(`${tech.id}-${dateStr}`) || [];
                      const today = isToday(day);
                      return (
                        <td
                          key={dateStr}
                          className={`p-1.5 align-top ${today ? 'bg-[var(--low-bg)]' : ''}`}
                        >
                          {dayShifts.length > 0 ? (
                            <div className="space-y-1">
                              {dayShifts.map(shift => {
                                const sCfg = SHIFT_STATUS_CONFIG[shift.status] || SHIFT_STATUS_CONFIG.scheduled;
                                return (
                                  <button
                                    key={shift.id}
                                    onClick={() => openEdit(shift)}
                                    className={`w-full text-left p-1.5 rounded-lg text-[11px] border transition-all hover:shadow-[var(--sh-1)] ${sCfg.color} border-current/10`}
                                  >
                                    <div className="flex items-center gap-1 font-medium">
                                      <Clock className="w-3 h-3 shrink-0" />
                                      {shift.start_time?.slice(0, 5)}–{shift.end_time?.slice(0, 5)}
                                    </div>
                                    {shift.campus && (
                                      <div className="flex items-center gap-1 mt-0.5 opacity-80">
                                        <MapPin className="w-3 h-3 shrink-0" />
                                        <span className="truncate">{shift.campus}</span>
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <button
                              onClick={() => openCreate(tech.id, dateStr)}
                              className="w-full h-12 rounded-lg border border-dashed border-[var(--line)] text-[var(--faint)] hover:border-[var(--selva-500)] hover:text-[var(--selva-500)] hover:bg-[var(--low-bg)] transition-colors flex items-center justify-center"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Shift form dialog */}
      <Dialog open={showShiftDialog} onOpenChange={setShowShiftDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingShift ? 'Editar Turno' : 'Crear Turno'}</DialogTitle>
            <DialogDescription>
              {editingShift
                ? 'Modifica los datos del turno.'
                : 'Asigna un nuevo turno a un tecnico.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--ink-2)] mb-1">Tecnico *</label>
              <select
                value={formTechId}
                onChange={e => setFormTechId(e.target.value ? Number(e.target.value) : '')}
                className="nw-input"
              >
                <option value="">Seleccionar tecnico...</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ink-2)] mb-1">Fecha *</label>
              <input
                type="date"
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
                className="nw-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[var(--ink-2)] mb-1">Hora inicio *</label>
                <input
                  type="time"
                  value={formStartTime}
                  onChange={e => setFormStartTime(e.target.value)}
                  className="nw-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--ink-2)] mb-1">Hora fin *</label>
                <input
                  type="time"
                  value={formEndTime}
                  onChange={e => setFormEndTime(e.target.value)}
                  className="nw-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ink-2)] mb-1">Sede</label>
              <select
                value={formCampus}
                onChange={e => setFormCampus(e.target.value)}
                className="nw-input"
              >
                <option value="">Sin sede especifica</option>
                {CAMPUSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ink-2)] mb-1">Edificio / Sala</label>
              <input
                type="text"
                value={formBuilding}
                onChange={e => setFormBuilding(e.target.value)}
                placeholder="Ej: Bloque B, Salon 301"
                className="nw-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ink-2)] mb-1">Estado</label>
              <select
                value={formStatus}
                onChange={e => setFormStatus(e.target.value)}
                className="nw-input"
              >
                <option value="scheduled">Programado</option>
                <option value="active">Activo</option>
                <option value="completed">Completado</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            {editingShift && (
              <button
                onClick={confirmDelete}
                className="mr-auto flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--crit)] hover:text-[var(--crit)] hover:bg-[var(--crit-bg)] rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            )}
            <DialogClose className="nw-btn">
              Cancelar
            </DialogClose>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="nw-btn primary flex items-center gap-2 disabled:bg-[var(--surface-3)]"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingShift ? 'Guardar cambios' : 'Crear turno'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar turno</DialogTitle>
            <DialogDescription>
              ¿Eliminar el turno de {editingShift?.technician?.name || 'este tecnico'} del {editingShift?.date ? format(new Date(editingShift.date + 'T12:00:00'), "d 'de' MMMM", { locale: es }) : ''}? Esta accion no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose className="nw-btn">
              Cancelar
            </DialogClose>
            <button
              onClick={handleDelete}
              disabled={deleteShift.isPending}
              className="nw-btn flex items-center gap-2 bg-[var(--crit)] text-white hover:bg-[var(--crit)] disabled:bg-[var(--surface-3)]"
            >
              {deleteShift.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Eliminar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Tab 3: Carga por Tecnico ────────────────────────────────────────────

function WorkloadView() {
  const { data: techsData, isLoading: loadingTechs } = useUsers({ role: 'technician', per_page: 50 });
  const { data: ticketsData, isLoading: loadingTickets } = useTickets({ status: 'open,in_progress', per_page: 200 });

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const dateFrom = format(weekStart, 'yyyy-MM-dd');
  const dateTo = format(addDays(weekStart, 6), 'yyyy-MM-dd');

  const { data: shiftsData, isLoading: loadingShifts } = useShifts({
    date_from: dateFrom,
    date_to: dateTo,
    per_page: 200,
  });

  const isLoading = loadingTechs || loadingTickets || loadingShifts;
  const technicians = techsData?.data;
  const tickets = ticketsData?.data;
  const shiftsArr = shiftsData?.data;

  const MAX_CAPACITY = 10;

  const techWorkload = useMemo(() => {
    if (!technicians) return [];
    return technicians.map(tech => {
      const ticketCount = tickets?.filter(t => t.assigned_to === tech.id).length ?? 0;
      const shiftCount = shiftsArr?.filter(s => s.technician_id === tech.id).length ?? 0;
      const loadPercent = Math.min(Math.round((ticketCount / MAX_CAPACITY) * 100), 100);
      return { tech, ticketCount, shiftCount, loadPercent };
    }).sort((a, b) => b.ticketCount - a.ticketCount);
  }, [technicians, tickets, shiftsArr]);

  return (
    <div className="space-y-4">
      <div className="page-head">
        <div>
          <h1>Carga por Tecnico</h1>
          <p>Vision general de la carga operativa de cada tecnico</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="nw-card p-5">
              <div className="space-y-3">
                <div className="h-5 w-48 bg-[var(--surface-3)] rounded animate-pulse" />
                <div className="h-3 w-full bg-[var(--surface-3)] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : !techWorkload.length ? (
        <div className="nw-card p-12 text-center">
          <Users className="w-10 h-10 text-[var(--faint)] mx-auto mb-2" />
          <p className="text-[var(--muted)]">No hay tecnicos registrados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {techWorkload.map(({ tech, ticketCount, shiftCount, loadPercent }) => {
            let barColor = 'bg-[var(--selva-500)]';
            if (loadPercent >= 80) barColor = 'bg-[var(--crit)]';
            else if (loadPercent >= 50) barColor = 'bg-[var(--med)]';

            return (
              <div key={tech.id} className="nw-card p-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--low-bg)] flex items-center justify-center text-[var(--selva-500)] text-sm font-bold shrink-0">
                    {tech.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <p className="font-medium text-[var(--ink)]">{tech.name}</p>
                        <p className="text-xs text-[var(--muted)]">{tech.campus || 'Sin sede'}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[var(--muted)] shrink-0">
                        <span className="flex items-center gap-1">
                          <Ticket className="w-3.5 h-3.5" />
                          {ticketCount} tickets
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {shiftCount} turnos
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-[var(--surface-3)] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${barColor}`}
                          style={{ width: `${loadPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-[var(--ink-2)] w-8 text-right">
                        {loadPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
