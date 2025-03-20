
import { supabase } from "@/integrations/supabase/client";
import { FinanceSubcategory } from "./types";

export const fetchSubcategories = async (categoryId?: string): Promise<FinanceSubcategory[]> => {
  let query = supabase
    .from('finance_subcategories')
    .select('*')
    .order('name');
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
  
  return data as unknown as FinanceSubcategory[];
};

export const addSubcategory = async (subcategory: Omit<FinanceSubcategory, 'id' | 'created_at' | 'updated_at'>): Promise<FinanceSubcategory> => {
  const { data, error } = await supabase
    .from('finance_subcategories')
    .insert(subcategory)
    .select()
    .single();
    
  if (error) {
    console.error("Error adding subcategory:", error);
    throw error;
  }
  
  return data as unknown as FinanceSubcategory;
};

export const updateSubcategory = async (subcategory: FinanceSubcategory): Promise<FinanceSubcategory> => {
  const { data, error } = await supabase
    .from('finance_subcategories')
    .update({ name: subcategory.name, category_id: subcategory.category_id })
    .eq('id', subcategory.id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating subcategory:", error);
    throw error;
  }
  
  return data as unknown as FinanceSubcategory;
};

export const deleteSubcategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('finance_subcategories')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error("Error deleting subcategory:", error);
    throw error;
  }
};

export const bulkImportSubcategories = async (subcategories: Array<Omit<FinanceSubcategory, 'id' | 'created_at' | 'updated_at'>>): Promise<FinanceSubcategory[]> => {
  const { data, error } = await supabase
    .from('finance_subcategories')
    .insert(subcategories)
    .select();
    
  if (error) {
    console.error("Error bulk importing subcategories:", error);
    throw error;
  }
  
  return data as unknown as FinanceSubcategory[];
};
