
import React from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategoriesPage } from "@/hooks/finances/useCategoriesPage";
import { CategoryPageHeader } from "@/components/finances/categories/CategoryPageHeader";
import { CategoryList } from "@/components/finances/categories/CategoryList";
import { CategoryDialogs } from "@/components/finances/categories/CategoryDialogs";

export default function CategoriesPage() {
  const {
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
  } = useCategoriesPage();
  
  return (
    <Layout>
      <div className="space-y-6 animate-in">
        <CategoryPageHeader 
          onAddCategory={handleAddCategory} 
          onImportCategories={() => setShowImportDialog(true)} 
        />
        
        <Tabs defaultValue="income" value={activeTab} onValueChange={(value) => setActiveTab(value as 'income' | 'expense')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="income">Income Categories</TabsTrigger>
            <TabsTrigger value="expense">Expense Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="income" className="mt-4">
            <Card className="p-6">
              <CategoryList
                categories={categories}
                subcategories={subcategories}
                isLoading={isLoading}
                activeTab="income"
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onAddSubcategory={handleAddSubcategory}
                onEditSubcategory={handleEditSubcategory}
                onDeleteSubcategory={handleDeleteSubcategory}
                onAddCategory={handleAddCategory}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="expense" className="mt-4">
            <Card className="p-6">
              <CategoryList
                categories={categories}
                subcategories={subcategories}
                isLoading={isLoading}
                activeTab="expense"
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onAddSubcategory={handleAddSubcategory}
                onEditSubcategory={handleEditSubcategory}
                onDeleteSubcategory={handleDeleteSubcategory}
                onAddCategory={handleAddCategory}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <CategoryDialogs
        showCategoryDialog={showCategoryDialog}
        setShowCategoryDialog={setShowCategoryDialog}
        showSubcategoryDialog={showSubcategoryDialog}
        setShowSubcategoryDialog={setShowSubcategoryDialog}
        showImportDialog={showImportDialog}
        setShowImportDialog={setShowImportDialog}
        categoryToEdit={categoryToEdit}
        subcategoryToEdit={subcategoryToEdit}
        categories={categories}
        activeTab={activeTab}
        onCategorySubmit={handleCategorySubmit}
        onSubcategorySubmit={handleSubcategorySubmit}
        onImportComplete={handleImportComplete}
      />
    </Layout>
  );
}
