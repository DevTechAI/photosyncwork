
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  fetchCategories, 
  fetchSubcategories, 
  FinanceCategory,
  FinanceSubcategory,
  deleteCategory,
  deleteSubcategory
} from "@/hooks/finances/api/financeApi";

export function useCategoriesPage() {
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [subcategories, setSubcategories] = useState<FinanceSubcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showSubcategoryDialog, setShowSubcategoryDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<FinanceCategory | null>(null);
  const [subcategoryToEdit, setSubcategoryToEdit] = useState<FinanceSubcategory | null>(null);
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [categoriesData, subcategoriesData] = await Promise.all([
        fetchCategories(),
        fetchSubcategories()
      ]);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error("Error loading finance categories data:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddCategory = () => {
    setCategoryToEdit(null);
    setShowCategoryDialog(true);
  };
  
  const handleEditCategory = (category: FinanceCategory) => {
    setCategoryToEdit(category);
    setShowCategoryDialog(true);
  };
  
  const handleCategorySubmit = async () => {
    setShowCategoryDialog(false);
    await loadData();
    toast.success(`Category ${categoryToEdit ? "updated" : "added"} successfully`);
  };
  
  const handleAddSubcategory = () => {
    setSubcategoryToEdit(null);
    setShowSubcategoryDialog(true);
  };
  
  const handleEditSubcategory = (subcategory: FinanceSubcategory) => {
    setSubcategoryToEdit(subcategory);
    setShowSubcategoryDialog(true);
  };
  
  const handleSubcategorySubmit = async () => {
    setShowSubcategoryDialog(false);
    await loadData();
    toast.success(`Subcategory ${subcategoryToEdit ? "updated" : "added"} successfully`);
  };
  
  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? This will also delete all related subcategories and may affect existing transactions.")) {
      try {
        await deleteCategory(categoryId);
        await loadData();
        toast.success("Category deleted successfully");
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category");
      }
    }
  };
  
  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (confirm("Are you sure you want to delete this subcategory? This may affect existing transactions.")) {
      try {
        await deleteSubcategory(subcategoryId);
        await loadData();
        toast.success("Subcategory deleted successfully");
      } catch (error) {
        console.error("Error deleting subcategory:", error);
        toast.error("Failed to delete subcategory");
      }
    }
  };
  
  const handleImportComplete = async () => {
    setShowImportDialog(false);
    await loadData();
    toast.success("Categories imported successfully");
  };

  return {
    categories,
    subcategories,
    isLoading,
    showCategoryDialog,
    setShowCategoryDialog,
    showSubcategoryDialog,
    setShowSubcategoryDialog,
    showImportDialog,
    setShowImportDialog,
    categoryToEdit,
    subcategoryToEdit,
    activeTab,
    setActiveTab,
    handleAddCategory,
    handleEditCategory,
    handleCategorySubmit,
    handleAddSubcategory,
    handleEditSubcategory,
    handleSubcategorySubmit,
    handleDeleteCategory,
    handleDeleteSubcategory,
    handleImportComplete
  };
}
