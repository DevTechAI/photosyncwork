
import { useState } from "react";
import { FinanceTransaction } from "@/hooks/finances/api/financeApi";

export function useTransactionState() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinanceTransaction | null>(null);

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
    setSelectedTransaction
  };
}
