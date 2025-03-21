
import { useTransactionState } from "./state/useTransactionState";
import { useTransactionsQuery } from "./queries/useTransactionsQuery";
import { useTransactionActions } from "./actions/useTransactionActions";
import { useTransactionFilters } from "./filters/useTransactionFilters";
import { FinanceTransaction } from "@/hooks/finances/api/financeApi";

export function useTransactionView() {
  const {
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
    setSelectedTransaction
  } = useTransactionState();

  const { data: transactions = [], isLoading } = useTransactionsQuery(filterType, filterCategory);
  
  const {
    handleEdit: baseHandleEdit,
    handleDelete: baseHandleDelete,
    confirmDelete: baseConfirmDelete,
    handleSubmitEdit
  } = useTransactionActions();

  // Wrap the action functions to provide the state setters
  const handleEdit = (transaction: FinanceTransaction) => {
    baseHandleEdit(transaction, setSelectedTransaction, setIsEditModalOpen);
  };

  const handleDelete = (transaction: FinanceTransaction) => {
    baseHandleDelete(transaction, setSelectedTransaction, setIsDeleteDialogOpen);
  };

  const confirmDelete = async () => {
    await baseConfirmDelete(selectedTransaction, setIsDeleteDialogOpen, setSelectedTransaction);
  };

  const filteredTransactions = useTransactionFilters(transactions, searchTerm);

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
