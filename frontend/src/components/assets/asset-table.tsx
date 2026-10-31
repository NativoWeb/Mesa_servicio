export function AssetTable() {
  return (
    <div className="bg-[var(--surface)] rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-[var(--surface-2)]">
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">Equipo</th>
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">Categoría</th>
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">Marca/Modelo</th>
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">Sede</th>
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">Cuentadante</th>
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">Estado</th>
            <th className="text-left p-3 text-xs font-semibold text-[var(--muted)]">Próx. Mant.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7} className="p-12 text-center text-[var(--faint)]">
              Los datos de activos se cargarán desde la API
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
