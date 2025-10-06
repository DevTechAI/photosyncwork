import { supabase } from '../../integrations/supabase/client';

// =====================================================
// Finance Query Types
// =====================================================

export interface FinanceTransaction {
  id: string;
  amount: number;
  transaction_type: 'income' | 'expenses';
  description: string;
  transaction_date: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface FinanceMetrics {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

// =====================================================
// Finance Queries
// =====================================================

/**
 * Get all finance transactions
 */
export async function getFinanceTransactions(): Promise<FinanceTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('finance_transactions')
      .select('*')
      .order('transaction_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching finance transactions:', error);
    return [];
  }
}

/**
 * Get finance metrics for dashboard
 */
export async function getFinanceMetrics(): Promise<FinanceMetrics> {
  try {
    const { data, error } = await supabase
      .from('finance_transactions')
      .select('amount, transaction_type, transaction_date');

    if (error) throw error;

    const transactions = data || [];
    const currentMonth = new Date();
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    const totalIncome = transactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalExpenses = transactions
      .filter(t => t.transaction_type === 'expenses')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const monthlyIncome = transactions
      .filter(t => t.transaction_type === 'income' && new Date(t.transaction_date) >= monthStart)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const monthlyExpenses = transactions
      .filter(t => t.transaction_type === 'expenses' && new Date(t.transaction_date) >= monthStart)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses
    };
  } catch (error) {
    console.error('Error fetching finance metrics:', error);
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netProfit: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0
    };
  }
}
