
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchTransactions,
  deleteTransaction,
  FinanceTransaction,
} from "@/hooks/finances/api/financeApi";

export function useTransactionView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinanceTransaction | null>(null);
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
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

  const handleEdit = (transaction: FinanceTransaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDelete = (transaction: FinanceTransaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTransaction) return;
    
    try {
      await deleteTransaction(selectedTransaction.id);
      toast.success("Transaction deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedTransaction(null);
    }
  };

  const handleSubmitEdit = async () => {
    setIsEditModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    toast.success("Transaction updated successfully");
  };

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

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedTransaction,
    filteredTransactions,
    isLoading,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleSubmitEdit
  };
}
