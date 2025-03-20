
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { getTransactionStats } from "@/hooks/finances/api/statsApi";

export function useFinancesPage() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [summaryStats, setSummaryStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netAmount: 0,
    incomeByCategory: [],
    expenseByCategory: []
  });
  
  // Current month range for default stats
  const today = new Date();
  const startDate = format(startOfMonth(today), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(today), 'yyyy-MM-dd');
  
  const { isLoading: isStatsLoading } = useQuery({
    queryKey: ['transactionStats', startDate, endDate],
    queryFn: async () => {
      try {
        const stats = await getTransactionStats(startDate, endDate);
        setSummaryStats(stats);
        return stats;
      } catch (error) {
        console.error("Error loading transaction stats:", error);
        toast.error("Failed to load financial statistics");
        throw error;
      }
    }
  });
  
  const handleNewTransaction = () => {
    setIsTransactionModalOpen(true);
  };
  
  const handleTransactionSubmit = async () => {
    setIsTransactionModalOpen(false);
    toast.success("Transaction recorded successfully");
  };
  
  // Generate monthly revenue data
  const revenueData = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(new Date(), 5 - i);
    return {
      month: format(month, 'MMM'),
      income: Math.round(Math.random() * 100000 + 100000),
      expense: Math.round(Math.random() * 50000 + 30000)
    };
  });

  return {
    isTransactionModalOpen,
    setIsTransactionModalOpen,
    activeTab,
    setActiveTab,
    selectedYear, 
    setSelectedYear,
    summaryStats,
    isStatsLoading,
    handleNewTransaction,
    handleTransactionSubmit,
    revenueData
  };
}
