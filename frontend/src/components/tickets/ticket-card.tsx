interface TicketCardProps {
  ticketNumber: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: string;
  date: string;
  assignee?: string;
}

const priorityColors = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const priorityLabels = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

export function TicketCard({ ticketNumber, title, category, priority, status, date, assignee }: TicketCardProps) {
  return (
    <div className="bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-mono font-medium text-gray-900">{ticketNumber}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[priority]}`}>
          {priorityLabels[priority]}
        </span>
      </div>
      <p className="text-xs text-gray-400 uppercase tracking-wider">{category}</p>
      <h3 className="font-medium text-gray-900 mt-1 text-sm leading-snug">{title}</h3>
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <span className="text-xs text-gray-500">{status}</span>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      {assignee && (
        <p className="text-xs text-gray-500 mt-2">👤 {assignee}</p>
      )}
    </div>
  );
}
