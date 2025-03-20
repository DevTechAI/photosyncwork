
import React from "react";
import { Card } from "@/components/ui/card";
import { IndianRupee, ArrowUpRight, ArrowDownRight, PieChart, CalendarDays } from "lucide-react";

interface FinanceOverviewCardsProps {
  summaryStats: {
    totalIncome: number;
    totalExpense: number;
    netAmount: number;
    incomeByCategory: any[];
    expenseByCategory: any[];
  };
}

export function FinanceOverviewCards({ summaryStats }: FinanceOverviewCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 rounded-full">
            <IndianRupee className="h-4 w-4 text-green-600" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Total Income
          </span>
        </div>
        <p className="text-2xl font-semibold mt-2">
          ₹{summaryStats.totalIncome.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 mt-1 text-green-600">
          <ArrowUpRight className="h-4 w-4" />
          <span className="text-sm">This Month</span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 rounded-full">
            <IndianRupee className="h-4 w-4 text-red-600" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </span>
        </div>
        <p className="text-2xl font-semibold mt-2">
          ₹{summaryStats.totalExpense.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 mt-1 text-red-600">
          <ArrowDownRight className="h-4 w-4" />
          <span className="text-sm">This Month</span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-full">
            <PieChart className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Net Profit
          </span>
        </div>
        <p className="text-2xl font-semibold mt-2">
          ₹{summaryStats.netAmount.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 mt-1 text-blue-600">
          <ArrowUpRight className="h-4 w-4" />
          <span className="text-sm">This Month</span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-full">
            <CalendarDays className="h-4 w-4 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Budget Status
          </span>
        </div>
        <p className="text-2xl font-semibold mt-2">
          {summaryStats.totalExpense > 0 ? 
            Math.round((summaryStats.totalExpense / (summaryStats.totalExpense * 1.2)) * 100) : 0}%
        </p>
        <div className="flex items-center gap-1 mt-1 text-purple-600">
          <span className="text-sm">of monthly budget</span>
        </div>
      </Card>
    </div>
  );
}
