
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, FileWarning } from "lucide-react";
import { bulkImportCategories, bulkImportSubcategories } from "@/hooks/finances/api/financeApi";
import * as XLSX from "xlsx";

interface ImportCategoriesFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ImportCategoriesForm({ onSuccess, onCancel }: ImportCategoriesFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const parseExcelFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        toast.error("Invalid Excel file: No sheets found");
        return null;
      }
      
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log("Parsed Excel data:", jsonData);
      return jsonData;
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      toast.error("Failed to parse Excel file. Make sure it's a valid .xlsx file.");
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileSelected(file);
    const jsonData = await parseExcelFile(file);
    
    if (jsonData && jsonData.length > 0) {
      setPreviewData(jsonData.slice(0, 5)); // Show the first 5 rows as preview
      toast.success(`File loaded successfully. Found ${jsonData.length} records.`);
    } else {
      setPreviewData([]);
    }
  };

  const handleImport = async () => {
    if (!fileSelected) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setIsLoading(true);
      
      const jsonData = await parseExcelFile(fileSelected);
      if (!jsonData || jsonData.length === 0) {
        toast.error("No valid data found in the file");
        return;
      }
      
      // Extract categories and subcategories
      const categories: Array<{name: string, type: 'income' | 'expense'}> = [];
      const subcategoriesMap = new Map<string, string[]>();
      
      // Check for required columns
      const firstRow = jsonData[0];
      const hasCategoryName = 'Category Name' in firstRow || 'category_name' in firstRow;
      const hasCategoryType = 'Category Type' in firstRow || 'category_type' in firstRow;
      
      if (!hasCategoryName) {
        toast.error("Excel file must have a 'Category Name' or 'category_name' column");
        return;
      }
      
      console.log("Processing data for import:", jsonData);
      
      // Expected Excel format:
      // Category Name | Category Type | Subcategory Name
      for (const row of jsonData) {
        const categoryName = row['Category Name'] || row['category_name'] || '';
        const categoryType = (row['Category Type'] || row['category_type'] || 'expense').toLowerCase();
        const subcategoryName = row['Subcategory Name'] || row['subcategory_name'] || '';
        
        console.log(`Processing row: Category=${categoryName}, Type=${categoryType}, Subcategory=${subcategoryName}`);
        
        if (!categoryName) {
          console.warn("Skipping row without category name:", row);
          continue;
        }
        
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
          const subcategories = subcategoriesMap.get(categoryName) || [];
          if (!subcategories.includes(subcategoryName)) {
            subcategories.push(subcategoryName);
          }
        }
      }
      
      console.log("Categories to import:", categories);
      
      // Import categories first
      if (categories.length === 0) {
        toast.error("No valid categories found in the file");
        return;
      }
      
      const importedCategories = await bulkImportCategories(categories);
      console.log("Imported categories:", importedCategories);
      
      // Create a mapping of category names to IDs
      const categoryMap = new Map<string, string>();
      importedCategories.forEach(cat => {
        categoryMap.set(cat.name, cat.id);
      });
      
      // Now import subcategories
      const subcategories: Array<{name: string, category_id: string}> = [];
      for (const [categoryName, subNames] of subcategoriesMap.entries()) {
        const categoryId = categoryMap.get(categoryName);
        if (categoryId) {
          for (const subName of subNames) {
            subcategories.push({
              name: subName,
              category_id: categoryId
            });
          }
        } else {
          console.warn(`Category ID not found for "${categoryName}"`);
        }
      }
      
      console.log("Subcategories to import:", subcategories);
      
      if (subcategories.length > 0) {
        const importedSubcategories = await bulkImportSubcategories(subcategories);
        console.log("Imported subcategories:", importedSubcategories);
      }
      
      toast.success(`Imported ${importedCategories.length} categories and ${subcategories.length} subcategories`);
      onSuccess();
      
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import data. Please check your Excel file format and try again.");
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
            onChange={handleFileChange}
            disabled={isLoading}
            className="max-w-sm"
          />
        </div>
        
        {fileSelected && (
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium">File selected: {fileSelected.name}</p>
          </div>
        )}
        
        {previewData.length > 0 && (
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
                      {Object.values(row).map((value: any, j) => (
                        <td key={j} className="py-2 px-3">{String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {previewData.length === 0 && fileSelected && (
          <div className="flex items-center p-3 text-amber-500 bg-amber-500/10 rounded-md">
            <FileWarning className="h-5 w-5 mr-2" />
            <span>No data preview available. Please ensure your file has the correct format.</span>
          </div>
        )}
        
        <div className="flex justify-end gap-3 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={isLoading || !fileSelected}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isLoading ? "Importing..." : "Import Categories"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
