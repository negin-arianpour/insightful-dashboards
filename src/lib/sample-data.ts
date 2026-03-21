export interface DataRow {
  [key: string]: string | number;
}

export const sampleData: DataRow[] = [
  { month: "Jan", revenue: 42500, expenses: 31200, customers: 1840, churn: 3.2 },
  { month: "Feb", revenue: 48200, expenses: 33100, customers: 1920, churn: 2.8 },
  { month: "Mar", revenue: 51800, expenses: 34500, customers: 2100, churn: 2.5 },
  { month: "Apr", revenue: 47300, expenses: 32800, customers: 2050, churn: 3.1 },
  { month: "May", revenue: 55100, expenses: 36200, customers: 2280, churn: 2.2 },
  { month: "Jun", revenue: 62400, expenses: 38900, customers: 2510, churn: 1.9 },
  { month: "Jul", revenue: 58700, expenses: 37100, customers: 2430, churn: 2.4 },
  { month: "Aug", revenue: 64200, expenses: 39800, customers: 2620, churn: 1.7 },
  { month: "Sep", revenue: 71500, expenses: 42300, customers: 2890, churn: 1.5 },
  { month: "Oct", revenue: 68900, expenses: 41100, customers: 2780, churn: 1.8 },
  { month: "Nov", revenue: 75200, expenses: 44500, customers: 3050, churn: 1.3 },
  { month: "Dec", revenue: 82100, expenses: 47200, customers: 3280, churn: 1.1 },
];

export function parseCSV(text: string): DataRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: DataRow = {};
    headers.forEach((header, i) => {
      const num = Number(values[i]);
      row[header] = isNaN(num) || values[i] === "" ? values[i] : num;
    });
    return row;
  });
}

export function detectNumericColumns(data: DataRow[]): string[] {
  if (data.length === 0) return [];
  return Object.keys(data[0]).filter((key) =>
    data.every((row) => typeof row[key] === "number")
  );
}

export function detectStringColumns(data: DataRow[]): string[] {
  if (data.length === 0) return [];
  return Object.keys(data[0]).filter((key) =>
    data.some((row) => typeof row[key] === "string")
  );
}

export function computeKPIs(data: DataRow[], numericCols: string[]) {
  return numericCols.slice(0, 4).map((col) => {
    const values = data.map((r) => r[col] as number);
    const current = values[values.length - 1];
    const previous = values[values.length - 2] || current;
    const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
    return {
      label: col.charAt(0).toUpperCase() + col.slice(1),
      value: current,
      change: Number(change.toFixed(1)),
    };
  });
}
