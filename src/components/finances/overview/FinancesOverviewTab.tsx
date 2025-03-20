
import React from "react";
import { FinanceOverviewCards } from "./FinanceOverviewCards";
import { FinanceCharts } from "./FinanceCharts";

interface FinancesOverviewTabProps {
  summaryStats: {
    totalIncome: number;
    totalExpense: number;
    netAmount: number;
    incomeByCategory: any[];
    expenseByCategory: any[];
  };
  revenueData: {
    month: string;
    income: number;
    expense: number;
  }[];
}

export function FinancesOverviewTab({ summaryStats, revenueData }: FinancesOverviewTabProps) {
  return (
    <>
      <FinanceOverviewCards summaryStats={summaryStats} />
      <FinanceCharts 
        revenueData={revenueData} 
        expenseByCategory={summaryStats.expenseByCategory} 
      />
    </>
  );
}
