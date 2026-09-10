'use client';

import { useShifts } from '@/hooks/use-shifts';
import { useAuthStore } from '@/stores/auth-store';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MiTurnoPage() {
  const user = useAuthStore(s => s.user);

  const { data, isLoading } = useShifts({
    technician_id: user?.id ?? 0,
    per_page: 30,
  });

  const shifts = data?.data || [];

  // Group shifts by week for the calendar
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const shift = shifts.find(s => s.date?.startsWith(dateStr));
    return { date, dateStr, shift, isToday: isToday(date) };
  });

  const activeShift = shifts.find(s => s.status === 'active' || (s.date && isToday(new Date(s.date))));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Turno</h1>
        <p className="text-gray-500 text-sm">Consulta tu horario semanal asignado</p>
      </div>

      {/* Active Shift Card */}
      {activeShift ? (
        <div className="bg-white rounded-xl border-2 border-green-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-bold text-green-700 uppercase tracking-wider bg-green-100 px-2 py-0.5 rounded">Turno Activo</span>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {format(new Date(activeShift.date), "EEEE d 'de' MMMM", { locale: es })}
                  {activeShift.start_time && activeShift.end_time && ` · ${activeShift.start_time} - ${activeShift.end_time}`}
                </p>
                <p className="text-sm text-gray-500">{activeShift.campus || 'Sin sede'}{activeShift.building ? ` · ${activeShift.building}` : ''}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl border p-6 text-center text-gray-500">
          No tienes turno activo hoy
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Turnos esta semana', value: weekDays.filter(d => d.shift).length, sub: 'Programados' },
          { label: 'Total turnos', value: shifts.length, sub: 'Registrados' },
          { label: 'Sede principal', value: user?.campus || '-', sub: 'Asignada' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow">
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-700">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Weekly Calendar */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Calendario Semanal</h2>
        <p className="text-sm text-gray-500 mb-5">
          Semana del {format(weekStart, "d 'de' MMMM", { locale: es })}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(({ date, shift, isToday: isTodayDate }) => (
              <div
                key={date.toISOString()}
                className={`rounded-xl p-3 text-center transition-colors ${
                  shift
                    ? isTodayDate
                      ? 'bg-green-50 border-2 border-green-300 ring-2 ring-green-100'
                      : 'bg-white border hover:border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <p className={`text-xs font-semibold uppercase ${shift ? 'text-gray-700' : 'text-gray-400'}`}>
                  {format(date, 'EEE', { locale: es })}
                </p>
                <p className={`text-2xl font-bold my-1 ${
                  shift ? (isTodayDate ? 'text-green-700' : 'text-gray-900') : 'text-gray-300'
                }`}>
                  {format(date, 'd')}
                </p>
                {shift ? (
                  <div className="space-y-1">
                    {shift.start_time && shift.end_time && (
                      <p className="text-[11px] font-medium text-gray-700">{shift.start_time} - {shift.end_time}</p>
                    )}
                    <p className="text-[10px] text-gray-500">{shift.campus}</p>
                    {shift.building && <p className="text-[10px] text-gray-400">{shift.building}</p>}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 mt-2">Sin turno</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
