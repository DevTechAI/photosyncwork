
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, FileWarning, Info } from "lucide-react";
import { bulkImportCategories, bulkImportSubcategories } from "@/hooks/finances/api/financeApi";
import * as XLSX from "xlsx";

interface ImportCategoriesFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Define the expected structure for the Excel data
interface CategoryImportRow {
  [key: string]: string | number | null;
}

export function ImportCategoriesForm({ onSuccess, onCancel }: ImportCategoriesFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<CategoryImportRow[]>([]);
  const [importError, setImportError] = useState<string | null>(null);

  const parseExcelFile = async (file: File) => {
    try {
      setImportError(null);
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        const error = "Invalid Excel file: No sheets found";
        setImportError(error);
        toast.error(error);
        return null;
      }
      
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<CategoryImportRow>(worksheet);
      
      console.log("Parsed Excel data:", jsonData);

      if (jsonData.length === 0) {
        const error = "Excel file is empty or contains no valid data";
        setImportError(error);
        toast.error(error);
        return null;
      }
      
      // Validate that the Excel has the required columns
      const firstRow = jsonData[0];
      let categoryColumn = null;
      
      // Check for various possible column names
      if ('Main Category' in firstRow) categoryColumn = 'Main Category';
      else if ('main_category' in firstRow) categoryColumn = 'main_category'; 
      else if ('Category' in firstRow) categoryColumn = 'Category';
      else if ('category' in firstRow) categoryColumn = 'category';
      else if ('Category Name' in firstRow) categoryColumn = 'Category Name';
      else if ('category_name' in firstRow) categoryColumn = 'category_name';
      
      if (!categoryColumn) {
        const error = "Excel file must have a column for categories (Main Category, Category, Category Name)";
        setImportError(error);
        toast.error(error);
        return null;
      }
      
      return jsonData;
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      const errorMessage = "Failed to parse Excel file. Make sure it's a valid .xlsx file.";
      setImportError(errorMessage);
      toast.error(errorMessage);
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
      
      // Determine column names from the first row
      const firstRow = jsonData[0];
      
      // Look for category column
      let categoryColumn = null;
      if ('Main Category' in firstRow) categoryColumn = 'Main Category';
      else if ('main_category' in firstRow) categoryColumn = 'main_category';
      else if ('Category' in firstRow) categoryColumn = 'Category';
      else if ('category' in firstRow) categoryColumn = 'category';
      else if ('Category Name' in firstRow) categoryColumn = 'Category Name';
      else if ('category_name' in firstRow) categoryColumn = 'category_name';
      
      // Look for subcategory column
      let subcategoryColumn = null;
      if ('Subcategory' in firstRow) subcategoryColumn = 'Subcategory';
      else if ('subcategory' in firstRow) subcategoryColumn = 'subcategory';
      else if ('Subcategory Name' in firstRow) subcategoryColumn = 'Subcategory Name';
      else if ('subcategory_name' in firstRow) subcategoryColumn = 'subcategory_name';
      
      // Look for type column
      let typeColumn = null;
      if ('Type' in firstRow) typeColumn = 'Type';
      else if ('type' in firstRow) typeColumn = 'type';
      else if ('Category Type' in firstRow) typeColumn = 'Category Type';
      else if ('category_type' in firstRow) typeColumn = 'category_type';
      
      if (!categoryColumn) {
        toast.error("Excel file must have a column for categories");
        return;
      }
      
      console.log("Processing data for import:", jsonData);
      console.log(`Using columns: Category=${categoryColumn}, Type=${typeColumn}, Subcategory=${subcategoryColumn}`);
      
      // Process each row in the Excel file
      for (const row of jsonData) {
        // Get category name from the identified column
        const categoryName = row[categoryColumn]?.toString().trim() || '';
        
        // Determine category type (income or expense)
        let categoryType: 'income' | 'expense' = 'expense'; // Default to expense
        
        if (typeColumn && row[typeColumn]) {
          const typeValue = row[typeColumn]?.toString().toLowerCase() || '';
          categoryType = typeValue === 'income' ? 'income' : 'expense';
        } else {
          // If no type column, try to guess from the category name
          if (categoryName.toLowerCase() === 'income') {
            categoryType = 'income';
          }
        }
        
        // Get subcategory if available
        const subcategoryName = subcategoryColumn ? (row[subcategoryColumn]?.toString().trim() || '') : '';
        
        console.log(`Processing row: Category=${categoryName}, Type=${categoryType}, Subcategory=${subcategoryName}`);
        
        if (!categoryName) {
          console.warn("Skipping row without category name:", row);
          continue;
        }
        
        // Add category if not already in the list
        if (!categories.some(c => c.name === categoryName && c.type === categoryType)) {
          categories.push({
            name: categoryName,
            type: categoryType
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
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100 flex items-start">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Expected Excel Format:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>A column for categories (called "Main Category", "Category", or "Category Name")</li>
              <li>Optional column for type ("Type" or "Category Type") with values "income" or "expense"</li>
              <li>Optional column for subcategories (called "Subcategory" or "Subcategory Name")</li>
            </ul>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            disabled={isLoading}
            className="max-w-sm"
          />
          <Button 
            variant="outline" 
            onClick={() => {
              setFileSelected(null);
              setPreviewData([]);
              setImportError(null);
              const fileInput = document.getElementById('file-upload') as HTMLInputElement;
              if (fileInput) fileInput.value = '';
            }}
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
        
        {importError && (
          <div className="flex items-center p-3 text-red-500 bg-red-50 rounded-md border border-red-100">
            <FileWarning className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{importError}</span>
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
                      {Object.entries(row).map(([key, value], j) => (
                        <td key={j} className="py-2 px-3">{value !== null ? String(value) : ''}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {previewData.length === 0 && fileSelected && !importError && (
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
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import Categories
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
