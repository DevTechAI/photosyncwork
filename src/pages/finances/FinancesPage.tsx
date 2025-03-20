import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  CalendarDays,
  Receipt,
  Tags,
  FileSpreadsheet,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartPieChart,
  Pie,
  Cell,
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/finances/transactions/TransactionForm";
import { fetchCategories, FinanceCategory, getTransactionStats } from "@/hooks/finances/api/financeApi";
import { toast } from "sonner";
import { TransactionsView } from "@/components/finances/transactions/TransactionsView";
import { FinancialReports } from "@/components/finances/reports/FinancialReports";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { useQuery } from "@tanstack/react-query";

export default function FinancesPage() {
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
  const navigate = useNavigate();
  
  // Current month range for default stats
  const today = new Date();
  const startDate = format(startOfMonth(today), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(today), 'yyyy-MM-dd');
  
  // Use React Query to fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
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
    
    // Invalidate and refetch the relevant queries
    // This will be handled by the QueryClient in the updated components
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

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Finances</h1>
            <p className="text-muted-foreground mt-2">
              Manage your business finances and track revenue
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select 
              defaultValue={selectedYear}
              onValueChange={setSelectedYear}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" asChild>
              <Link to="/finances/categories">
                <Tags className="mr-2 h-4 w-4" />
                Manage Categories
              </Link>
            </Button>
            
            <Button onClick={handleNewTransaction}>
              <Receipt className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
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

            <div className="grid gap-4 md:grid-cols-2 mt-8">
              <Card className="p-6">
                <h3 className="font-semibold mb-6">Revenue Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      name="Income"
                      dataKey="income"
                      stroke="#0088FE"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      name="Expense"
                      dataKey="expense"
                      stroke="#FF8042"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-6">Expenses by Category</h3>
                {summaryStats.expenseByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartPieChart>
                      <Pie
                        data={summaryStats.expenseByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="amount"
                        nameKey="category"
                      >
                        {summaryStats.expenseByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No expense data available for this period
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-0">
            <TransactionsView 
              categories={categories} 
              onAddTransaction={handleNewTransaction} 
            />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-0">
            <FinancialReports year={selectedYear} />
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Record New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm 
            onSubmit={handleTransactionSubmit} 
            categories={categories} 
            onCancel={() => setIsTransactionModalOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
