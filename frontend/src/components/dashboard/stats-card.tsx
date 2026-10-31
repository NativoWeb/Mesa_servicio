interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export function StatsCard({ label, value, icon, trend, trendUp, color = "text-[var(--ink)]" }: StatsCardProps) {
  return (
    <div className="bg-[var(--surface)] rounded-xl border p-4 hover:shadow-[var(--sh-1)] transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-wider">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trendUp ? "text-[var(--selva-500)]" : "text-[var(--crit)]"}`}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        {icon && <div className="text-[var(--faint)]">{icon}</div>}
      </div>
    </div>
  );
}
