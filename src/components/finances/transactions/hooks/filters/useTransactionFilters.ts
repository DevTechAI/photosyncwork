
import { FinanceTransaction } from "@/hooks/finances/api/financeApi";

export function useTransactionFilters(transactions: FinanceTransaction[], searchTerm: string) {
  const filteredTransactions = transactions.filter(transaction => {
    if (searchTerm === "") return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.description?.toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchLower) ||
      transaction.transaction_date.includes(searchLower) ||
      transaction.payment_method?.toLowerCase().includes(searchLower)
    );
  });

  return filteredTransactions;
}
