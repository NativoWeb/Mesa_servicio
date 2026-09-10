interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  formats: string[];
}

export function ReportCard({ id, title, description, formats }: ReportCardProps) {
  return (
    <div className="bg-white rounded-xl border p-6 hover:shadow-sm transition-shadow">
      <p className="text-xs text-gray-500 font-medium">{id}</p>
      <h3 className="font-semibold text-gray-900 mt-1">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
      <div className="flex items-center gap-2 mt-3">
        {formats.map((f) => (
          <span key={f} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded font-medium uppercase">{f}</span>
        ))}
      </div>
      <button className="mt-3 text-sm text-green-700 font-medium hover:underline">
        Generar reporte →
      </button>
    </div>
  );
}
