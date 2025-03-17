
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { 
  fetchCategories, 
  fetchSubcategories, 
  FinanceCategory,
  FinanceSubcategory,
  deleteCategory,
  deleteSubcategory
} from "@/hooks/finances/api/financeApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "@/components/finances/categories/CategoryForm";
import { SubcategoryForm } from "@/components/finances/categories/SubcategoryForm";
import { ImportCategoriesForm } from "@/components/finances/categories/ImportCategoriesForm";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [subcategories, setSubcategories] = useState<FinanceSubcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showSubcategoryDialog, setShowSubcategoryDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<FinanceCategory | null>(null);
  const [subcategoryToEdit, setSubcategoryToEdit] = useState<FinanceSubcategory | null>(null);
  const [activeTab, setActiveTab] = useState("income");
  
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
  
  // Filter categories by type based on the active tab
  const filteredCategories = categories.filter(category => category.type === activeTab);
  
  return (
    <Layout>
      <div className="space-y-6 animate-in">
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
              onClick={() => setShowImportDialog(true)}
            >
              Import Categories
            </Button>
            <Button onClick={handleAddCategory}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="income" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="income">Income Categories</TabsTrigger>
            <TabsTrigger value="expense">Expense Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="income" className="mt-4">
            <Card className="p-6">
              {isLoading ? (
                <div className="py-8 text-center">Loading categories...</div>
              ) : filteredCategories.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No income categories found</p>
                  <Button onClick={handleAddCategory} variant="outline" className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Income Category
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="border rounded-md">
                      <div className="p-4 flex items-center justify-between bg-muted/50">
                        <h3 className="font-medium">{category.name}</h3>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditCategory(category)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeleteCategory(category.id)}
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
                                    onClick={() => handleEditSubcategory(subcategory)}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-destructive"
                                    onClick={() => handleDeleteSubcategory(subcategory.id)}
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
                            onClick={handleAddSubcategory}
                          >
                            <PlusCircle className="mr-2 h-3 w-3" />
                            Add Subcategory
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="expense" className="mt-4">
            <Card className="p-6">
              {isLoading ? (
                <div className="py-8 text-center">Loading categories...</div>
              ) : filteredCategories.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No expense categories found</p>
                  <Button onClick={handleAddCategory} variant="outline" className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Expense Category
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="border rounded-md">
                      <div className="p-4 flex items-center justify-between bg-muted/50">
                        <h3 className="font-medium">{category.name}</h3>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditCategory(category)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeleteCategory(category.id)}
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
                                    onClick={() => handleEditSubcategory(subcategory)}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-destructive"
                                    onClick={() => handleDeleteSubcategory(subcategory.id)}
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
                            onClick={handleAddSubcategory}
                          >
                            <PlusCircle className="mr-2 h-3 w-3" />
                            Add Subcategory
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{categoryToEdit ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <CategoryForm 
            initialData={categoryToEdit}
            onSubmit={handleCategorySubmit}
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
            selectedCategoryType={activeTab as 'income' | 'expense'}
            onSubmit={handleSubcategorySubmit}
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
            onSubmitSuccess={handleImportComplete}
            onCancel={() => setShowImportDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
