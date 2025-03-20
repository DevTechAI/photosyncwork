
import React from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryBreakdownTabProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  categoryData: {
    income: CategoryData[];
    expense: CategoryData[];
  };
  months: string[];
  year: string;
  COLORS: string[];
}

export function CategoryBreakdownTab({ 
  selectedMonth, 
  setSelectedMonth, 
  categoryData, 
  months, 
  year,
  COLORS 
}: CategoryBreakdownTabProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Category Breakdown</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Month:</span>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month} {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-medium mb-3 text-center">Income by Category</h4>
          {categoryData.income.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData.income}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.income.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-[300px] text-muted-foreground">
              No income data for {months[parseInt(selectedMonth)]} {year}
            </div>
          )}
        </div>
        
        <div>
          <h4 className="text-md font-medium mb-3 text-center">Expenses by Category</h4>
          {categoryData.expense.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData.expense}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.expense.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-[300px] text-muted-foreground">
              No expense data for {months[parseInt(selectedMonth)]} {year}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-md font-medium mb-3">Top Categories</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-sm font-medium mb-2 text-blue-700">Top Income Sources</h5>
            <div className="space-y-2">
              {categoryData.income.slice(0, 3).map((category: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span>{category.name}</span>
                  <span className="font-medium">₹{category.value.toLocaleString()}</span>
                </div>
              ))}
              {categoryData.income.length === 0 && (
                <div className="text-muted-foreground text-sm">No data available</div>
              )}
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium mb-2 text-red-700">Top Expense Categories</h5>
            <div className="space-y-2">
              {categoryData.expense.slice(0, 3).map((category: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span>{category.name}</span>
                  <span className="font-medium">₹{category.value.toLocaleString()}</span>
                </div>
              ))}
              {categoryData.expense.length === 0 && (
                <div className="text-muted-foreground text-sm">No data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
