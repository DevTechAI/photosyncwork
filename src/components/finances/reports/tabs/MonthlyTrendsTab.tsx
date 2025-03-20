
import React from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  profit: number;
}

interface MonthlyTrendsTabProps {
  isLoading: boolean;
  monthlyData: MonthlyData[];
  year: string;
}

export function MonthlyTrendsTab({ isLoading, monthlyData, year }: MonthlyTrendsTabProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Income & Expense Trends ({year})</h3>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : monthlyData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, undefined]} />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#0088FE" />
            <Bar dataKey="expense" name="Expense" fill="#FF8042" />
            <Bar dataKey="profit" name="Profit" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-[400px] text-muted-foreground">
          No data available for {year}
        </div>
      )}
      
      <div className="mt-6">
        <h4 className="text-md font-medium mb-3">Monthly Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-blue-50 border-blue-100">
            <p className="text-sm text-blue-700 font-medium">Total Income</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              ₹{monthlyData.reduce((sum, month) => sum + month.income, 0).toLocaleString()}
            </p>
          </Card>
          <Card className="p-4 bg-red-50 border-red-100">
            <p className="text-sm text-red-700 font-medium">Total Expenses</p>
            <p className="text-2xl font-bold text-red-700 mt-1">
              ₹{monthlyData.reduce((sum, month) => sum + month.expense, 0).toLocaleString()}
            </p>
          </Card>
          <Card className="p-4 bg-green-50 border-green-100">
            <p className="text-sm text-green-700 font-medium">Net Profit</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              ₹{monthlyData.reduce((sum, month) => sum + month.profit, 0).toLocaleString()}
            </p>
          </Card>
        </div>
      </div>
    </Card>
  );
}
