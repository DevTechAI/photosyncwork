
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExcelFileUploaderProps {
  isLoading: boolean;
  fileSelected: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
}

export function ExcelFileUploader({
  isLoading,
  fileSelected,
  onFileChange,
  onClearFile
}: ExcelFileUploaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          id="file-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileChange}
          disabled={isLoading}
          className="max-w-sm"
        />
        <Button 
          variant="outline" 
          onClick={onClearFile}
          disabled={!fileSelected || isLoading}
        >
          Clear
        </Button>
      </div>
      
      {fileSelected && (
        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm font-medium">File selected: {fileSelected.name}</p>
        </div>
      )}
    </div>
  );
}
