
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileSpreadsheet } from "lucide-react";

interface CategoryPageHeaderProps {
  onAddCategory: () => void;
  onImportCategories: () => void;
}

export function CategoryPageHeader({ onAddCategory, onImportCategories }: CategoryPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Finance Categories</h1>
        <p className="text-muted-foreground mt-2">
          Manage your income and expense categories for financial tracking
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onImportCategories}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Import from Excel
        </Button>
        <Button onClick={onAddCategory}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
    </div>
  );
}
