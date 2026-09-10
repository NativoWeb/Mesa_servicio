import { StatsCard } from "./stats-card";

interface KpiCardsProps {
  stats: Array<{
    label: string;
    value: string | number;
    color?: string;
    trend?: string;
    trendUp?: boolean;
  }>;
}

export function KpiCards({ stats }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
