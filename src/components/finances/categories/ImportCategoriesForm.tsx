
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowUpTrayIcon } from "lucide-react";
import { bulkImportCategories, bulkImportSubcategories } from "@/hooks/finances/api/financeApi";
import * as XLSX from "xlsx";

export function ImportCategoriesForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      
      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Extract categories and subcategories
      const categories = [];
      const subcategoriesMap = new Map();
      
      // Expected Excel format:
      // Category Name | Category Type | Subcategory Name
      for (const row of jsonData) {
        const categoryName = row['Category Name'] || row['category_name'] || '';
        const categoryType = (row['Category Type'] || row['category_type'] || 'expense').toLowerCase();
        const subcategoryName = row['Subcategory Name'] || row['subcategory_name'] || '';
        
        if (!categoryName) continue;
        
        // Add category if not already in the list
        if (!categories.some(c => c.name === categoryName && c.type === categoryType)) {
          categories.push({
            name: categoryName,
            type: categoryType === 'income' ? 'income' : 'expense'
          });
        }
        
        // Add subcategory if provided
        if (subcategoryName) {
          if (!subcategoriesMap.has(categoryName)) {
            subcategoriesMap.set(categoryName, []);
          }
          subcategoriesMap.get(categoryName).push(subcategoryName);
        }
      }
      
      // Import categories first
      const importedCategories = await bulkImportCategories(categories);
      
      // Create a mapping of category names to IDs
      const categoryMap = new Map();
      importedCategories.forEach(cat => {
        categoryMap.set(cat.name, cat.id);
      });
      
      // Now import subcategories
      const subcategories = [];
      for (const [categoryName, subNames] of subcategoriesMap.entries()) {
        const categoryId = categoryMap.get(categoryName);
        if (categoryId) {
          for (const subName of subNames) {
            subcategories.push({
              name: subName,
              category_id: categoryId
            });
          }
        }
      }
      
      if (subcategories.length > 0) {
        await bulkImportSubcategories(subcategories);
      }
      
      toast.success(`Imported ${importedCategories.length} categories and ${subcategories.length} subcategories`);
      onSuccess();
      
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import data. Please check your Excel file format.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Import Categories from Excel</h3>
      
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Upload an Excel file with your categories and subcategories. The file should have columns:
          "Category Name", "Category Type" (income/expense), and "Subcategory Name" (optional).
        </p>
        
        <div className="flex items-center gap-4">
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="max-w-sm"
          />
          
          <Button disabled={isLoading} variant="outline">
            <ArrowUpTrayIcon className="mr-2 h-4 w-4" />
            {isLoading ? "Importing..." : "Upload File"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
