
import { FinanceTransaction, deleteTransaction } from "@/hooks/finances/api/financeApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useTransactionActions() {
  const queryClient = useQueryClient();

  const handleEdit = (
    transaction: FinanceTransaction, 
    setSelectedTransaction: (transaction: FinanceTransaction) => void,
    setIsEditModalOpen: (isOpen: boolean) => void
  ) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDelete = (
    transaction: FinanceTransaction,
    setSelectedTransaction: (transaction: FinanceTransaction) => void,
    setIsDeleteDialogOpen: (isOpen: boolean) => void
  ) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async (
    selectedTransaction: FinanceTransaction | null,
    setIsDeleteDialogOpen: (isOpen: boolean) => void,
    setSelectedTransaction: (transaction: FinanceTransaction | null) => void
  ) => {
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
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    toast.success("Transaction updated successfully");
  };

  return {
    handleEdit,
    handleDelete,
    confirmDelete,
    handleSubmitEdit
  };
}
