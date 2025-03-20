
import { supabase } from "@/integrations/supabase/client";
import { TransactionStats } from "./types";
import { FinanceTransaction } from "./types";

export const getTransactionStats = async (
  startDate: string,
  endDate: string
): Promise<TransactionStats> => {
  // Fetch all transactions in date range with category information
  const { data: transactionsData, error } = await supabase
    .from('finance_transactions')
    .select(`
      *,
      finance_categories:category_id(name)
    `)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate);
    
  if (error) {
    console.error("Error fetching transaction stats:", error);
    throw error;
  }

  // Process transactions
  const transactions = transactionsData as unknown as (FinanceTransaction & { finance_categories: { name: string } })[];
  
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
    incomeByCategory.push({ category, amount });
  }
  
  for (const [category, amount] of Object.entries(expenseCategories)) {
    expenseByCategory.push({ category, amount });
  }
  
  return {
    totalIncome,
    totalExpense,
    netAmount: totalIncome - totalExpense,
    incomeByCategory,
    expenseByCategory
  };
};
