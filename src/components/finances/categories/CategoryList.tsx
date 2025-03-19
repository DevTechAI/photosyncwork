
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FinanceCategory, FinanceSubcategory } from "@/hooks/finances/api/financeApi";

interface CategoryListProps {
  categories: FinanceCategory[];
  subcategories: FinanceSubcategory[];
  isLoading: boolean;
  activeTab: string;
  onEditCategory: (category: FinanceCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddSubcategory: () => void;
  onEditSubcategory: (subcategory: FinanceSubcategory) => void;
  onDeleteSubcategory: (subcategoryId: string) => void;
  onAddCategory: () => void;
}

export function CategoryList({
  categories,
  subcategories,
  isLoading,
  activeTab,
  onEditCategory,
  onDeleteCategory,
  onAddSubcategory,
  onEditSubcategory,
  onDeleteSubcategory,
  onAddCategory
}: CategoryListProps) {
  // Filter categories by type based on the active tab
  const filteredCategories = categories.filter(category => category.type === activeTab);

  if (isLoading) {
    return <div className="py-8 text-center">Loading categories...</div>;
  }

  if (filteredCategories.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No {activeTab} categories found</p>
        <Button onClick={onAddCategory} variant="outline" className="mt-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add {activeTab === "income" ? "Income" : "Expense"} Category
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredCategories.map((category) => (
        <div key={category.id} className="border rounded-md">
          <div className="p-4 flex items-center justify-between bg-muted/50">
            <h3 className="font-medium">{category.name}</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEditCategory(category)}
              >
                Edit
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-destructive"
                onClick={() => onDeleteCategory(category.id)}
              >
                Delete
              </Button>
            </div>
          </div>
          
          {/* Subcategories */}
          <div className="p-4">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Subcategories</h4>
            <div className="pl-2 space-y-2">
              {subcategories
                .filter(sub => sub.category_id === category.id)
                .map(subcategory => (
                  <div key={subcategory.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                    <span>{subcategory.name}</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEditSubcategory(subcategory)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive"
                        onClick={() => onDeleteSubcategory(subcategory.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              {subcategories.filter(sub => sub.category_id === category.id).length === 0 && (
                <p className="text-sm text-muted-foreground">No subcategories</p>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={onAddSubcategory}
              >
                <PlusCircle className="mr-2 h-3 w-3" />
                Add Subcategory
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
