import { supabase } from "@/integrations/supabase/client";
import { FinanceTransaction } from "./types";

export const fetchTransactions = async (filters?: {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  subcategoryId?: string;
  type?: 'income' | 'expense';
  sourceId?: string;
  sourceType?: string;
}): Promise<FinanceTransaction[]> => {
  try {
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
      if (filters.sourceId) {
        query = query.eq('source_id', filters.sourceId);
      }
      if (filters.sourceType) {
        query = query.eq('source_type', filters.sourceType);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching transactions:", error);
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
    
    // Ensure amount is returned as a number
    return data ? data.map(item => ({
      ...item,
      amount: Number(item.amount)
    })) as FinanceTransaction[] : [];
  } catch (error) {
    console.error("Error in fetchTransactions:", error);
    throw error;
  }
};

export const fetchTransactionsBySource = async (sourceId: string, sourceType?: string): Promise<FinanceTransaction[]> => {
  try {
    let query = supabase
      .from('finance_transactions')
      .select('*')
      .eq('source_id', sourceId)
      .order('transaction_date', { ascending: false });
    
    if (sourceType) {
      query = query.eq('source_type', sourceType);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching transactions by source:", error);
      throw new Error(`Failed to fetch transactions by source: ${error.message}`);
    }
    
    return data ? data.map(item => ({
      ...item,
      amount: Number(item.amount)
    })) as FinanceTransaction[] : [];
  } catch (error) {
    console.error("Error in fetchTransactionsBySource:", error);
    throw error;
  }
};

export const addTransaction = async (transaction: Omit<FinanceTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<FinanceTransaction> => {
  try {
    // Convert amount to number before sending to Supabase
    const transactionData = {
      ...transaction,
      amount: Number(transaction.amount)
    };

    // For metadata, convert to plain object to ensure it's compatible with Supabase jsonb
    if (transactionData.metadata && typeof transactionData.metadata === 'object') {
      transactionData.metadata = JSON.parse(JSON.stringify(transactionData.metadata));
    }

    const { data, error } = await supabase
      .from('finance_transactions')
      .insert(transactionData)
      .select()
      .single();
      
    if (error) {
      console.error("Error adding transaction:", error);
      throw new Error(`Failed to add transaction: ${error.message}`);
    }
    
    return {
      ...data,
      amount: Number(data.amount)
    } as FinanceTransaction;
  } catch (error) {
    console.error("Error in addTransaction:", error);
    throw error;
  }
};

export const updateTransaction = async (transaction: FinanceTransaction): Promise<FinanceTransaction> => {
  try {
    const { id, created_at, updated_at, ...updateData } = transaction;
    
    // Convert amount to number before sending to Supabase
    const transactionData = {
      ...updateData,
      amount: Number(updateData.amount)
    };

    // For metadata, convert to plain object to ensure it's compatible with Supabase jsonb
    if (transactionData.metadata && typeof transactionData.metadata === 'object') {
      transactionData.metadata = JSON.parse(JSON.stringify(transactionData.metadata));
    }

    const { data, error } = await supabase
      .from('finance_transactions')
      .update(transactionData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating transaction:", error);
      throw new Error(`Failed to update transaction: ${error.message}`);
    }
    
    return {
      ...data,
      amount: Number(data.amount)
    } as FinanceTransaction;
  } catch (error) {
    console.error("Error in updateTransaction:", error);
    throw error;
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('finance_transactions')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting transaction:", error);
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in deleteTransaction:", error);
    throw error;
  }
};