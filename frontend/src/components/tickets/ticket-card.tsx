import { User } from "lucide-react";

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
  low: "bg-[var(--surface-3)] text-[var(--muted)]",
  medium: "bg-[var(--med-bg)] text-[var(--med)]",
  high: "bg-[var(--high-bg)] text-[var(--high)]",
  critical: "bg-[var(--crit-bg)] text-[var(--crit)]",
};

const priorityLabels = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
};

export function TicketCard({ ticketNumber, title, category, priority, status, date, assignee }: TicketCardProps) {
  return (
    <div className="bg-[var(--surface)] rounded-xl border p-4 hover:shadow-[var(--sh-1)] transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-mono font-medium text-[var(--ink)]">{ticketNumber}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[priority]}`}>
          {priorityLabels[priority]}
        </span>
      </div>
      <p className="text-xs text-[var(--faint)] uppercase tracking-wider">{category}</p>
      <h3 className="font-medium text-[var(--ink)] mt-1 text-sm leading-snug">{title}</h3>
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <span className="text-xs text-[var(--muted)]">{status}</span>
        <span className="text-xs text-[var(--faint)]">{date}</span>
      </div>
      {assignee && (
        <p className="text-xs text-[var(--muted)] mt-2 flex items-center gap-1"><User className="w-3 h-3 inline" /> {assignee}</p>
      )}
    </div>
  );
}
