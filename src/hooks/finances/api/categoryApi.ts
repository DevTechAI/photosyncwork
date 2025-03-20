
import { supabase } from "@/integrations/supabase/client";
import { FinanceCategory } from "./types";

export const fetchCategories = async (): Promise<FinanceCategory[]> => {
  const { data, error } = await supabase
    .from('finance_categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
  
  return data as unknown as FinanceCategory[];
};

export const addCategory = async (category: Omit<FinanceCategory, 'id' | 'created_at' | 'updated_at'>): Promise<FinanceCategory> => {
  const { data, error } = await supabase
    .from('finance_categories')
    .insert(category)
    .select()
    .single();
    
  if (error) {
    console.error("Error adding category:", error);
    throw error;
  }
  
  return data as unknown as FinanceCategory;
};

export const updateCategory = async (category: FinanceCategory): Promise<FinanceCategory> => {
  const { data, error } = await supabase
    .from('finance_categories')
    .update({ name: category.name, type: category.type })
    .eq('id', category.id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating category:", error);
    throw error;
  }
  
  return data as unknown as FinanceCategory;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('finance_categories')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const bulkImportCategories = async (categories: Array<Omit<FinanceCategory, 'id' | 'created_at' | 'updated_at'>>): Promise<FinanceCategory[]> => {
  const { data, error } = await supabase
    .from('finance_categories')
    .insert(categories)
    .select();
    
  if (error) {
    console.error("Error bulk importing categories:", error);
    throw error;
  }
  
  return data as unknown as FinanceCategory[];
};
