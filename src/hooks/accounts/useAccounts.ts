import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  Account, 
  CreateAccountData, 
  UpdateAccountData, 
  AccountSummary, 
  OverdueAccount,
  AccountTransactionType 
} from '@/types/accounts';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  // Create new account
  const createAccount = async (accountData: CreateAccountData): Promise<Account | null> => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert([accountData])
        .select()
        .single();

      if (error) throw error;
      
      setAccounts(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      return null;
    }
  };

  // Update account
  const updateAccount = async (id: string, updates: UpdateAccountData): Promise<Account | null> => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setAccounts(prev => prev.map(account => 
        account.id === id ? data : account
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update account');
      return null;
    }
  };

  // Delete account
  const deleteAccount = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAccounts(prev => prev.filter(account => account.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      return false;
    }
  };

  // Get account by ID
  const getAccount = async (id: string): Promise<Account | null> => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch account');
      return null;
    }
  };

  // Get account summary
  const getAccountSummary = async (id: string): Promise<AccountSummary | null> => {
    try {
      const { data, error } = await supabase
        .rpc('get_account_summary', { account_id: id });

      if (error) throw error;
      return data?.[0] || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch account summary');
      return null;
    }
  };

  // Get overdue accounts
  const getOverdueAccounts = async (daysThreshold: number = 30): Promise<OverdueAccount[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_overdue_accounts', { days_threshold: daysThreshold });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch overdue accounts');
      return [];
    }
  };

  // Update account balance
  const updateAccountBalance = async (
    accountId: string, 
    amount: number, 
    transactionType: AccountTransactionType
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .rpc('update_account_balance', {
          account_id: accountId,
          amount: amount,
          transaction_type: transactionType
        });

      if (error) throw error;
      
      // Refresh accounts to get updated balances
      await fetchAccounts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update account balance');
      return false;
    }
  };

  // Search accounts
  const searchAccounts = async (query: string): Promise<Account[]> => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .or(`account_name.ilike.%${query}%,account_number.ilike.%${query}%,client_name.ilike.%${query}%,client_email.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search accounts');
      return [];
    }
  };

  // Filter accounts by type
  const getAccountsByType = (type: 'client' | 'vendor' | 'internal'): Account[] => {
    return accounts.filter(account => account.account_type === type);
  };

  // Filter accounts by status
  const getAccountsByStatus = (status: 'active' | 'suspended' | 'closed' | 'pending'): Account[] => {
    return accounts.filter(account => account.status === status);
  };

  // Get accounts with outstanding balance
  const getAccountsWithOutstandingBalance = (): Account[] => {
    return accounts.filter(account => account.outstanding_balance > 0);
  };

  // Get total outstanding balance
  const getTotalOutstandingBalance = (): number => {
    return accounts.reduce((total, account) => total + account.outstanding_balance, 0);
  };

  // Get total invoiced amount
  const getTotalInvoicedAmount = (): number => {
    return accounts.reduce((total, account) => total + account.total_invoiced, 0);
  };

  // Get total paid amount
  const getTotalPaidAmount = (): number => {
    return accounts.reduce((total, account) => total + account.total_paid, 0);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccount,
    getAccountSummary,
    getOverdueAccounts,
    updateAccountBalance,
    searchAccounts,
    getAccountsByType,
    getAccountsByStatus,
    getAccountsWithOutstandingBalance,
    getTotalOutstandingBalance,
    getTotalInvoicedAmount,
    getTotalPaidAmount,
    clearError: () => setError(null)
  };
}
