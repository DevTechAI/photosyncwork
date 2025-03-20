
import React from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
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

interface CashFlowTabProps {
  isLoading: boolean;
  monthlyData: MonthlyData[];
  year: string;
}

export function CashFlowTab({ isLoading, monthlyData, year }: CashFlowTabProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Cash Flow Analysis ({year})</h3>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : monthlyData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, undefined]} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              name="Income" 
              stroke="#0088FE" 
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="expense" 
              name="Expense" 
              stroke="#FF8042" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              name="Net Cash Flow" 
              stroke="#00C49F"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-[400px] text-muted-foreground">
          No data available for {year}
        </div>
      )}
      
      <div className="mt-6">
        <h4 className="text-md font-medium mb-3">Cash Flow Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border">
            <p className="text-sm text-muted-foreground font-medium">Average Monthly Income</p>
            <p className="text-xl font-bold mt-1">
              ₹{monthlyData.length > 0 
                ? Math.round(monthlyData.reduce((sum, month) => sum + month.income, 0) / monthlyData.length).toLocaleString() 
                : 0}
            </p>
          </Card>
          
          <Card className="p-4 border">
            <p className="text-sm text-muted-foreground font-medium">Average Monthly Expense</p>
            <p className="text-xl font-bold mt-1">
              ₹{monthlyData.length > 0 
                ? Math.round(monthlyData.reduce((sum, month) => sum + month.expense, 0) / monthlyData.length).toLocaleString() 
                : 0}
            </p>
          </Card>
          
          <Card className="p-4 border">
            <p className="text-sm text-muted-foreground font-medium">Highest Income Month</p>
            <p className="text-xl font-bold mt-1">
              {monthlyData.length > 0 
                ? monthlyData.reduce((prev, current) => (prev.income > current.income) ? prev : current).month
                : "-"}
            </p>
          </Card>
          
          <Card className="p-4 border">
            <p className="text-sm text-muted-foreground font-medium">Highest Expense Month</p>
            <p className="text-xl font-bold mt-1">
              {monthlyData.length > 0 
                ? monthlyData.reduce((prev, current) => (prev.expense > current.expense) ? prev : current).month
                : "-"}
            </p>
          </Card>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-md font-medium mb-3">Cash Flow Ratio</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border">
            <p className="text-sm text-muted-foreground font-medium">Income to Expense Ratio</p>
            <p className="text-xl font-bold mt-1">
              {monthlyData.length > 0 
                ? (monthlyData.reduce((sum, month) => sum + month.income, 0) / 
                   monthlyData.reduce((sum, month) => sum + month.expense, 0)).toFixed(2)
                : "-"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {monthlyData.length > 0 && 
               (monthlyData.reduce((sum, month) => sum + month.income, 0) / 
                monthlyData.reduce((sum, month) => sum + month.expense, 0)) >= 1.5
                ? "Excellent"
                : (monthlyData.reduce((sum, month) => sum + month.income, 0) / 
                   monthlyData.reduce((sum, month) => sum + month.expense, 0)) >= 1.2
                ? "Good"
                : "Needs Improvement"}
            </p>
          </Card>
          
          <Card className="p-4 border">
            <p className="text-sm text-muted-foreground font-medium">Profit Margin</p>
            <p className="text-xl font-bold mt-1">
              {monthlyData.length > 0 
                ? (monthlyData.reduce((sum, month) => sum + month.profit, 0) / 
                   monthlyData.reduce((sum, month) => sum + month.income, 0) * 100).toFixed(1) + "%"
                : "-"}
            </p>
          </Card>
          
          <Card className="p-4 border">
            <p className="text-sm text-muted-foreground font-medium">Monthly Growth Rate</p>
            <p className="text-xl font-bold mt-1">
              {monthlyData.length > 1 
                ? ((monthlyData[monthlyData.length - 1].income - monthlyData[0].income) / 
                    monthlyData[0].income * 100).toFixed(1) + "%"
                : "-"}
            </p>
          </Card>
        </div>
      </div>
    </Card>
  );
}
