
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { MonthlyTrendReport } from "./MonthlyTrendReport";
import { CategoryBreakdownReport } from "./CategoryBreakdownReport";
import { CashFlowReport } from "./CashFlowReport";
import { format, subMonths, parse, setMonth, setYear } from "date-fns";
import { fetchTransactions, getTransactionStats } from "@/hooks/finances/api/financeApi";
import { DownloadIcon, RefreshCw } from "lucide-react";

interface FinancialReportsProps {
  year: string;
}

export function FinancialReports({ year }: FinancialReportsProps) {
  const [activeReport, setActiveReport] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any>({
    income: [],
    expense: []
  });

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  const fetchMonthlyData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch data for each month of the selected year
      const monthlyStats = [];
      
      for (let month = 0; month < 12; month++) {
        const date = new Date();
        date.setFullYear(parseInt(year));
        date.setMonth(month);
        
        const startDate = format(new Date(parseInt(year), month, 1), 'yyyy-MM-dd');
        const endDate = format(new Date(parseInt(year), month + 1, 0), 'yyyy-MM-dd');
        
        const stats = await getTransactionStats(startDate, endDate);
        
        monthlyStats.push({
          month: format(date, 'MMM'),
          income: stats.totalIncome,
          expense: stats.totalExpense,
          profit: stats.netAmount
        });
      }
      
      setMonthlyData(monthlyStats);
      
      // Update category data for the selected month
      updateCategoryData(parseInt(selectedMonth));
      
    } catch (error) {
      console.error("Error fetching monthly data:", error);
      toast.error("Failed to load financial reports");
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateCategoryData = async (monthIndex: number) => {
    try {
      const startDate = format(new Date(parseInt(year), monthIndex, 1), 'yyyy-MM-dd');
      const endDate = format(new Date(parseInt(year), monthIndex + 1, 0), 'yyyy-MM-dd');
      
      const stats = await getTransactionStats(startDate, endDate);
      
      setCategoryData({
        income: stats.incomeByCategory.map(item => ({
          name: item.category,
          value: item.amount
        })),
        expense: stats.expenseByCategory.map(item => ({
          name: item.category,
          value: item.amount
        }))
      });
      
    } catch (error) {
      console.error("Error updating category data:", error);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, [year]);
  
  useEffect(() => {
    updateCategoryData(parseInt(selectedMonth));
  }, [selectedMonth, year]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Financial Reports</h2>
          <p className="text-muted-foreground mt-1">
            Analyze your financial data and trends
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchMonthlyData}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      <Tabs defaultValue="monthly" value={activeReport} onValueChange={setActiveReport}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="mt-6">
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
        </TabsContent>
        
        <TabsContent value="categories" className="mt-6">
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
        </TabsContent>
        
        <TabsContent value="cashflow" className="mt-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
