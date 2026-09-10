'use client';

import { useState } from 'react';

interface DaySchedule {
  day: string;
  number: number;
  startTime: string;
  endTime: string;
  campus: string;
  building: string;
  active: boolean;
}

const weekDays: DaySchedule[] = [
  { day: 'Lun', number: 14, startTime: '8:00', endTime: '17:00', campus: 'Sede Central', building: 'Edificio A', active: true },
  { day: 'Mar', number: 15, startTime: '8:00', endTime: '17:00', campus: 'Sede Central', building: 'Edificio A', active: true },
  { day: 'Mie', number: 16, startTime: '8:00', endTime: '17:00', campus: 'Sede Central', building: 'Edificio B', active: true },
  { day: 'Jue', number: 17, startTime: '8:00', endTime: '17:00', campus: 'Sede Norte', building: 'Edificio Principal', active: true },
  { day: 'Vie', number: 18, startTime: '8:00', endTime: '17:00', campus: 'Sede Central', building: 'Edificio A', active: true },
  { day: 'Sab', number: 19, startTime: '', endTime: '', campus: '', building: '', active: false },
  { day: 'Dom', number: 20, startTime: '', endTime: '', campus: '', building: '', active: false },
];

const upcomingWeeks = [
  { label: 'Semana del 21 al 27 de Octubre', status: 'Programado', days: '5 dias de turno' },
  { label: 'Semana del 28 de Octubre al 3 de Noviembre', status: 'Pendiente', days: 'Sin programar aun' },
];

export default function MiTurnoPage() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Turno</h1>
        <p className="text-gray-500 text-sm">Consulta tu horario semanal asignado y gestiona tu tiempo de servicio</p>
      </div>

      {/* Active Shift Card */}
      <div className="bg-white rounded-xl border-2 border-green-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-green-700 uppercase tracking-wider bg-green-100 px-2 py-0.5 rounded">Turno Activo Ahora</span>
              </div>
              <p className="text-lg font-bold text-gray-900">Hoy, Lunes &middot; 8:00 AM - 5:00 PM</p>
              <p className="text-sm text-gray-500">Sede Sede Central &middot; Edificio A</p>
            </div>
          </div>
          <div className="text-right md:border-l md:pl-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tiempo restante</p>
            <p className="text-3xl font-bold text-green-700">3h 20min</p>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
              <div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: '62%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: 'Dias con turno',
            value: '5 dias',
            sub: 'Esta semana',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            ),
            color: 'text-blue-700',
            bg: 'bg-blue-50',
          },
          {
            label: 'Horas asignadas',
            value: '40h',
            sub: 'Semana completa',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: 'text-purple-700',
            bg: 'bg-purple-50',
          },
          {
            label: 'Sede Principal',
            value: 'Sede Central',
            sub: 'Edificio A',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            ),
            color: 'text-green-700',
            bg: 'bg-green-50',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-700">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Weekly Calendar */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-gray-900">Calendario Semanal</h2>
            <p className="text-sm text-gray-500">Semana del 14 al 20 de Octubre</p>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div
              key={day.day}
              className={`rounded-xl p-3 text-center transition-colors ${
                day.active
                  ? day.day === 'Lun'
                    ? 'bg-green-50 border-2 border-green-300 ring-2 ring-green-100'
                    : 'bg-white border hover:border-green-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <p className={`text-xs font-semibold uppercase ${day.active ? 'text-gray-700' : 'text-gray-400'}`}>
                {day.day}
              </p>
              <p className={`text-2xl font-bold my-1 ${
                day.active
                  ? day.day === 'Lun' ? 'text-green-700' : 'text-gray-900'
                  : 'text-gray-300'
              }`}>
                {day.number}
              </p>
              {day.active ? (
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-gray-700">{day.startTime} - {day.endTime}</p>
                  <p className="text-[10px] text-gray-500">{day.campus}</p>
                  <p className="text-[10px] text-gray-400">{day.building}</p>
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 mt-2">Sin turno</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Weeks */}
      <div className="bg-white rounded-xl border">
        <div className="p-5 pb-0">
          <h2 className="font-semibold text-gray-900 mb-1">Proximas Semanas</h2>
          <p className="text-sm text-gray-500">Planificacion de turnos futuros</p>
        </div>
        <div className="p-5 space-y-2">
          {upcomingWeeks.map((week, i) => (
            <div key={i} className="border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedWeek(expandedWeek === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedWeek === i ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{week.label}</p>
                    <p className="text-xs text-gray-500">{week.days}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  week.status === 'Programado' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {week.status}
                </span>
              </button>
              {expandedWeek === i && (
                <div className="px-4 pb-4 border-t bg-gray-50/50">
                  <p className="text-sm text-gray-500 py-3">
                    {week.status === 'Programado'
                      ? 'Turno de Lunes a Viernes, 8:00 AM a 5:00 PM. Sede Sede Central - Edificio A.'
                      : 'La programacion de esta semana aun no ha sido publicada por la Direccion de TI.'
                    }
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-blue-900">Informacion sobre turnos</p>
          <p className="text-xs text-blue-700 mt-0.5">Los turnos son asignados por la Direccion de TI los dias viernes de cada semana anterior. Si necesitas un cambio, solicitalo con al menos 48 horas de anticipacion.</p>
        </div>
      </div>

      {/* Bottom action */}
      <div className="flex justify-end">
        <button className="bg-green-700 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          Solicitar Cambio
        </button>
      </div>
    </div>
  );
}
