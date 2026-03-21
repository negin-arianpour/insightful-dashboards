import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import type { DataRow } from "@/lib/sample-data";
import { detectNumericColumns, detectStringColumns } from "@/lib/sample-data";

const COLORS = [
  "hsl(174, 62%, 32%)",
  "hsl(30, 90%, 56%)",
  "hsl(220, 60%, 52%)",
  "hsl(340, 65%, 52%)",
  "hsl(140, 50%, 42%)",
];

export function DashboardCharts({ data }: { data: DataRow[] }) {
  const numericCols = detectNumericColumns(data);
  const stringCols = detectStringColumns(data);
  const labelKey = stringCols[0] || Object.keys(data[0])[0];

  if (numericCols.length === 0) {
    return <p className="text-muted-foreground">No numeric columns found to chart.</p>;
  }

  const col1 = numericCols[0];
  const col2 = numericCols[1];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Area chart for first metric */}
      <div className="bg-card rounded-xl p-5 border border-border/60">
        <h3 className="font-semibold mb-4 capitalize">{col1} Over Time</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS[0]} stopOpacity={0.2} />
                <stop offset="100%" stopColor={COLORS[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,16%,89%)" />
            <XAxis dataKey={labelKey} tick={{ fontSize: 12 }} stroke="hsl(200,10%,46%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(200,10%,46%)" />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(210,16%,89%)",
                fontSize: 13,
              }}
            />
            <Area type="monotone" dataKey={col1} stroke={COLORS[0]} fill="url(#grad1)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart for second metric */}
      {col2 && (
        <div className="bg-card rounded-xl p-5 border border-border/60">
          <h3 className="font-semibold mb-4 capitalize">{col2} Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,16%,89%)" />
              <XAxis dataKey={labelKey} tick={{ fontSize: 12 }} stroke="hsl(200,10%,46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(200,10%,46%)" />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(210,16%,89%)",
                  fontSize: 13,
                }}
              />
              <Bar dataKey={col2} fill={COLORS[1]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Line chart comparing metrics */}
      {numericCols.length >= 2 && (
        <div className="bg-card rounded-xl p-5 border border-border/60">
          <h3 className="font-semibold mb-4">Trend Comparison</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,16%,89%)" />
              <XAxis dataKey={labelKey} tick={{ fontSize: 12 }} stroke="hsl(200,10%,46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(200,10%,46%)" />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(210,16%,89%)",
                  fontSize: 13,
                }}
              />
              {numericCols.slice(0, 3).map((col, i) => (
                <Line key={col} type="monotone" dataKey={col} stroke={COLORS[i]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pie chart from latest row */}
      {numericCols.length >= 2 && (
        <div className="bg-card rounded-xl p-5 border border-border/60">
          <h3 className="font-semibold mb-4">Distribution (Latest)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={numericCols.slice(0, 5).map((col) => ({
                  name: col,
                  value: data[data.length - 1][col] as number,
                }))}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={3}
                dataKey="value"
                label={({ name }) => name}
              >
                {numericCols.slice(0, 5).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
