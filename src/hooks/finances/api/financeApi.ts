
import { supabase } from "@/integrations/supabase/client";

export interface FinanceCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  created_at?: string;
  updated_at?: string;
}

export interface FinanceSubcategory {
  id: string;
  category_id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface FinanceTransaction {
  id: string;
  category_id: string;
  subcategory_id?: string;
  amount: number;
  transaction_date: string;
  description?: string;
  transaction_type: 'income' | 'expense';
  payment_method?: string;
  created_at?: string;
  updated_at?: string;
}

// Categories
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

// Subcategories
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

// Transactions
export const fetchTransactions = async (filters?: {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  subcategoryId?: string;
  type?: 'income' | 'expense';
}): Promise<FinanceTransaction[]> => {
  let query = supabase
    .from('finance_transactions')
    .select('*')
    .order('transaction_date', { ascending: false });
  
  if (filters) {
    if (filters.startDate) {
      query = query.gte('transaction_date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('transaction_date', filters.endDate);
    }
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters.subcategoryId) {
      query = query.eq('subcategory_id', filters.subcategoryId);
    }
    if (filters.type) {
      query = query.eq('transaction_type', filters.type);
    }
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
  
  // Convert amount from string to number
  return (data as unknown as any[]).map(item => ({
    ...item,
    amount: Number(item.amount)
  })) as FinanceTransaction[];
};

export const addTransaction = async (transaction: Omit<FinanceTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<FinanceTransaction> => {
  // Convert amount to string for storage if needed
  const transactionData = {
    ...transaction,
    amount: transaction.amount.toString()
  };

  const { data, error } = await supabase
    .from('finance_transactions')
    .insert(transactionData)
    .select()
    .single();
    
  if (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
  
  // Convert amount back to number before returning
  return {
    ...data,
    amount: Number(data.amount)
  } as unknown as FinanceTransaction;
};

export const updateTransaction = async (transaction: FinanceTransaction): Promise<FinanceTransaction> => {
  const { id, created_at, updated_at, ...updateData } = transaction;
  
  // Convert amount to string for storage if needed
  const transactionData = {
    ...updateData,
    amount: updateData.amount.toString()
  };

  const { data, error } = await supabase
    .from('finance_transactions')
    .update(transactionData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
  
  // Convert amount back to number before returning
  return {
    ...data,
    amount: Number(data.amount)
  } as unknown as FinanceTransaction;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('finance_transactions')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

// Statistics and Reports
export const getTransactionStats = async (
  startDate: string,
  endDate: string
): Promise<{
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  incomeByCategory: { category: string; amount: number }[];
  expenseByCategory: { category: string; amount: number }[];
}> => {
  // Fetch all transactions in date range with category information
  const { data: transactionsData, error } = await supabase
    .from('finance_transactions')
    .select(`
      *,
      finance_categories(name)
    `)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate);
    
  if (error) {
    console.error("Error fetching transaction stats:", error);
    throw error;
  }

  // Cast the data to have proper type information
  const transactions = transactionsData as unknown as Array<FinanceTransaction & {
    finance_categories: { name: string }
  }>;
  
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpense = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  // Group by category
  const incomeByCategory: { category: string; amount: number }[] = [];
  const expenseByCategory: { category: string; amount: number }[] = [];
  
  const incomeCategories: Record<string, number> = {};
  const expenseCategories: Record<string, number> = {};
  
  for (const transaction of transactions) {
    const categoryName = transaction.finance_categories?.name || 'Uncategorized';
    const amount = Number(transaction.amount);
    
    if (transaction.transaction_type === 'income') {
      if (!incomeCategories[categoryName]) {
        incomeCategories[categoryName] = 0;
      }
      incomeCategories[categoryName] += amount;
    } else {
      if (!expenseCategories[categoryName]) {
        expenseCategories[categoryName] = 0;
      }
      expenseCategories[categoryName] += amount;
    }
  }
  
  for (const [category, amount] of Object.entries(incomeCategories)) {
    incomeByCategory.push({ category, amount: Number(amount) });
  }
  
  for (const [category, amount] of Object.entries(expenseCategories)) {
    expenseByCategory.push({ category, amount: Number(amount) });
  }
  
  return {
    totalIncome,
    totalExpense,
    netAmount: totalIncome - totalExpense,
    incomeByCategory,
    expenseByCategory
  };
};

// Utility function for bulk import
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
