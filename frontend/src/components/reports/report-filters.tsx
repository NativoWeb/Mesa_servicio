import { CAMPUSES } from '@/lib/constants';

export function ReportFilters() {
  return (
    <div className="bg-[var(--surface)] rounded-xl border p-4 flex items-center gap-4 flex-wrap">
      <div>
        <label className="block text-xs text-[var(--muted)] mb-1">Rango de fechas</label>
        <input type="date" className="px-3 py-1.5 border rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-xs text-[var(--muted)] mb-1">Sede</label>
        <select className="px-3 py-1.5 border rounded-lg text-sm">
          <option>Todas</option>
          {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-[var(--muted)] mb-1">Prioridad</label>
        <select className="px-3 py-1.5 border rounded-lg text-sm">
          <option>Todas</option>
          <option>Alta</option>
          <option>Media</option>
          <option>Baja</option>
        </select>
      </div>
      <button className="ml-auto bg-[var(--lima-500)] hover:bg-[var(--lima-400)] text-[var(--lima-ink)] px-4 py-1.5 rounded-lg text-sm font-medium">
        Aplicar filtros
      </button>
    </div>
  );
}
