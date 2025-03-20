
import React from "react";
import { FileWarning } from "lucide-react";

interface DataPreviewProps {
  previewData: Array<{[key: string]: string | number | null}>;
  fileSelected: File | null;
  importError: string | null;
}

export function DataPreview({ previewData, fileSelected, importError }: DataPreviewProps) {
  if (previewData.length === 0 && fileSelected && !importError) {
    return (
      <div className="flex items-center p-3 text-amber-500 bg-amber-500/10 rounded-md">
        <FileWarning className="h-5 w-5 mr-2" />
        <span>No data preview available. Please ensure your file has the correct format.</span>
      </div>
    );
  }

  if (previewData.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Data Preview (first 5 rows):</h4>
      <div className="bg-muted p-3 rounded-md overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-muted-foreground/20">
              {Object.keys(previewData[0]).map((key) => (
                <th key={key} className="py-2 px-3 text-left">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, i) => (
              <tr key={i} className="border-b border-muted-foreground/10">
                {Object.entries(row).map(([key, value], j) => (
                  <td key={j} className="py-2 px-3">{value !== null ? String(value) : ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
