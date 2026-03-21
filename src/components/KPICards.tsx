import { TrendingUp, TrendingDown } from "lucide-react";

interface KPI {
  label: string;
  value: number;
  change: number;
}

export function KPICards({ kpis }: { kpis: KPI[] }) {
  const formatValue = (val: number, label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes("revenue") || lower.includes("expense") || lower.includes("cost") || lower.includes("sales"))
      return `$${val.toLocaleString()}`;
    if (lower.includes("churn") || lower.includes("rate") || lower.includes("percent"))
      return `${val}%`;
    return val.toLocaleString();
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-card rounded-xl p-5 border border-border/60 card-hover"
        >
          <p className="text-sm text-muted-foreground mb-1 font-medium">{kpi.label}</p>
          <p className="text-2xl font-bold tracking-tight tabular-nums">
            {formatValue(kpi.value, kpi.label)}
          </p>
          <div
            className={`flex items-center gap-1 mt-2 text-sm font-medium ${
              kpi.change >= 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {kpi.change >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span className="tabular-nums">{kpi.change > 0 ? "+" : ""}{kpi.change}%</span>
            <span className="text-muted-foreground font-normal">vs prev</span>
          </div>
        </div>
      ))}
    </div>
  );
}
