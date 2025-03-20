
import React from "react";
import { FileWarning } from "lucide-react";

interface ImportErrorProps {
  error: string | null;
}

export function ImportError({ error }: ImportErrorProps) {
  if (!error) return null;
  
  return (
    <div className="flex items-center p-3 text-red-500 bg-red-50 rounded-md border border-red-100">
      <FileWarning className="h-5 w-5 mr-2 flex-shrink-0" />
      <span className="text-sm">{error}</span>
    </div>
  );
}
