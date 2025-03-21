
import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/hooks/finances/api/transactionApi";

export function useTransactionsQuery(filterType: string, filterCategory: string) {
  return useQuery({
    queryKey: ['transactions', filterType, filterCategory],
    queryFn: async () => {
      const filters: any = {};
      
      if (filterType !== "all") {
        filters.type = filterType as 'income' | 'expense';
      }
      
      if (filterCategory !== "all") {
        filters.categoryId = filterCategory;
      }
      
      return fetchTransactions(filters);
    }
  });
}
