
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "@/components/finances/categories/CategoryForm";
import { SubcategoryForm } from "@/components/finances/categories/SubcategoryForm";
import { ImportCategoriesForm } from "@/components/finances/categories/ImportCategoriesForm";
import { FinanceCategory, FinanceSubcategory } from "@/hooks/finances/api/financeApi";

interface CategoryDialogsProps {
  showCategoryDialog: boolean;
  setShowCategoryDialog: (show: boolean) => void;
  showSubcategoryDialog: boolean;
  setShowSubcategoryDialog: (show: boolean) => void;
  showImportDialog: boolean;
  setShowImportDialog: (show: boolean) => void;
  categoryToEdit: FinanceCategory | null;
  subcategoryToEdit: FinanceSubcategory | null;
  categories: FinanceCategory[];
  activeTab: 'income' | 'expense';
  onCategorySubmit: () => Promise<void>;
  onSubcategorySubmit: () => Promise<void>;
  onImportComplete: () => Promise<void>;
}

export function CategoryDialogs({
  showCategoryDialog,
  setShowCategoryDialog,
  showSubcategoryDialog,
  setShowSubcategoryDialog,
  showImportDialog,
  setShowImportDialog,
  categoryToEdit,
  subcategoryToEdit,
  categories,
  activeTab,
  onCategorySubmit,
  onSubcategorySubmit,
  onImportComplete
}: CategoryDialogsProps) {
  return (
    <>
      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{categoryToEdit ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <CategoryForm 
            initialData={categoryToEdit}
            onSubmit={onCategorySubmit}
            onCancel={() => setShowCategoryDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Subcategory Dialog */}
      <Dialog open={showSubcategoryDialog} onOpenChange={setShowSubcategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{subcategoryToEdit ? "Edit Subcategory" : "Add Subcategory"}</DialogTitle>
          </DialogHeader>
          <SubcategoryForm 
            initialData={subcategoryToEdit}
            categories={categories}
            categoryType={activeTab}
            onSubmit={onSubcategorySubmit}
            onCancel={() => setShowSubcategoryDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Categories</DialogTitle>
          </DialogHeader>
          <ImportCategoriesForm 
            onSuccess={onImportComplete}
            onCancel={() => setShowImportDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
