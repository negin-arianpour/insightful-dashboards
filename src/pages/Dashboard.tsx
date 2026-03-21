import { useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ArrowLeft, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataUpload } from "@/components/DataUpload";
import { KPICards } from "@/components/KPICards";
import { DashboardCharts } from "@/components/DashboardCharts";
import { ChatPanel } from "@/components/ChatPanel";
import { sampleData, computeKPIs, detectNumericColumns } from "@/lib/sample-data";
import type { DataRow } from "@/lib/sample-data";

const Dashboard = () => {
  const [data, setData] = useState<DataRow[] | null>(null);
  const [usingSample, setUsingSample] = useState(false);

  const activeData = data || (usingSample ? sampleData : null);
  const numericCols = activeData ? detectNumericColumns(activeData) : [];
  const kpis = activeData ? computeKPIs(activeData, numericCols) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/60">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight">DataLens</span>
          </Link>
          {activeData && (
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              {activeData.length} rows · {Object.keys(activeData[0]).length} columns
              {usingSample && " (sample)"}
            </span>
          )}
        </div>
        {activeData && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setData(null);
              setUsingSample(false);
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> New data
          </Button>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!activeData ? (
          <div className="max-w-xl mx-auto pt-16">
            <h2 className="text-2xl font-bold mb-2 text-center">Upload your data</h2>
            <p className="text-muted-foreground text-center mb-8">
              Drop a CSV file to auto-generate your dashboard
            </p>
            <DataUpload onDataLoaded={setData} />
            <div className="text-center mt-6">
              <button
                onClick={() => setUsingSample(true)}
                className="text-sm text-primary hover:underline underline-offset-4 font-medium"
              >
                Or try with sample data →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 fade-up">
            <KPICards kpis={kpis} />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardCharts data={activeData} />
              </div>
              <div>
                <ChatPanel data={activeData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
