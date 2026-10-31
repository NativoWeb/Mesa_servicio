export function TicketTable() {
  return (
    <div className="bg-[var(--surface)] rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-[var(--surface-2)]">
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">ID</th>
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">Asunto</th>
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">Categoría</th>
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">Prioridad</th>
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">Estado</th>
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">Sede</th>
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">Creado</th>
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">SLA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={8} className="p-12 text-center text-[var(--faint)]">
              Los datos de tickets se cargarán desde la API
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
