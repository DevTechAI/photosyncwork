
import React from "react";
import { Info } from "lucide-react";

export function ImportFormatInfo() {
  return (
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
  );
}
