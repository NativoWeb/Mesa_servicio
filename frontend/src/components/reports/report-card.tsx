interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  formats: string[];
}

export function ReportCard({ id, title, description, formats }: ReportCardProps) {
  return (
    <div className="bg-[var(--surface)] rounded-xl border p-6 hover:shadow-[var(--sh-1)] transition-shadow">
      <p className="text-xs text-[var(--muted)] font-medium">{id}</p>
      <h3 className="font-semibold text-[var(--ink)] mt-1">{title}</h3>
      <p className="text-xs text-[var(--muted)] mt-1">{description}</p>
      <div className="flex items-center gap-2 mt-3">
        {formats.map((f) => (
          <span key={f} className="text-[10px] px-2 py-0.5 bg-[var(--surface-3)] rounded font-medium uppercase">{f}</span>
        ))}
      </div>
      <button className="mt-3 text-sm text-[var(--selva-500)] font-medium hover:underline">
        Generar reporte →
      </button>
    </div>
  );
}
