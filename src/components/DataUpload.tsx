import { useCallback, useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { parseCSV } from "@/lib/sample-data";
interface DataUploadProps {
  onDataLoaded: (data: Record<string, string | number>[]) => void;
}

export function DataUpload({ onDataLoaded }: DataUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const { parseCSV } = require("@/lib/sample-data");
        const parsed = parseCSV(text);
        if (parsed.length > 0) onDataLoaded(parsed);
      };
      reader.readAsText(file);
    },
    [onDataLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors duration-200 cursor-pointer ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40"
      }`}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".csv,.json";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) handleFile(file);
        };
        input.click();
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-primary/8 flex items-center justify-center">
          {isDragging ? (
            <FileSpreadsheet className="w-7 h-7 text-primary" />
          ) : (
            <Upload className="w-7 h-7 text-primary" />
          )}
        </div>
        <div>
          <p className="font-semibold text-foreground mb-1">
            Drop your CSV file here
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse · CSV files supported
          </p>
        </div>
      </div>
    </div>
  );
}
