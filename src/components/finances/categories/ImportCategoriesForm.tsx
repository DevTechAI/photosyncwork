
import React from "react";
import { Card } from "@/components/ui/card";
import { useExcelImport } from "./hooks/useExcelImport";
import { ImportFormatInfo } from "./components/ImportFormatInfo";
import { ExcelFileUploader } from "./components/ExcelFileUploader";
import { ImportError } from "./components/ImportError";
import { DataPreview } from "./components/DataPreview";
import { ImportFormActions } from "./components/ImportFormActions";

interface ImportCategoriesFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ImportCategoriesForm({ onSuccess, onCancel }: ImportCategoriesFormProps) {
  const {
    isLoading,
    fileSelected,
    previewData,
    importError,
    handleFileChange,
    handleImport,
    clearFile
  } = useExcelImport(onSuccess);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Import Categories from Excel</h3>
      
      <div className="space-y-4">
        <ImportFormatInfo />
        
        <ExcelFileUploader
          isLoading={isLoading}
          fileSelected={fileSelected}
          onFileChange={handleFileChange}
          onClearFile={clearFile}
        />
        
        <ImportError error={importError} />
        
        <DataPreview 
          previewData={previewData} 
          fileSelected={fileSelected} 
          importError={importError} 
        />
        
        <ImportFormActions
          isLoading={isLoading}
          fileSelected={fileSelected}
          onCancel={onCancel}
          onImport={handleImport}
        />
      </div>
    </Card>
  );
}
