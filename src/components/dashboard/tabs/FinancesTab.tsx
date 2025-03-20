
import { DollarSign, AlertCircle, Clock, FileText, Receipt, TrendingUp, Users, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stats/StatCard";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/hooks/finances/api/transactionApi";
import { format, subDays } from "date-fns";

export function FinancesTab() {
  // Get transactions from the last 30 days
  const { data: recentTransactions = [] } = useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: async () => {
      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      return fetchTransactions({ startDate: thirtyDaysAgo });
    },
  });

  // Calculate summary stats
  const totalIncome = recentTransactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpense = recentTransactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const netAmount = totalIncome - totalExpense;
  
  // Get source distribution
  const invoicePayments = recentTransactions
    .filter(t => t.transaction_type === 'income' && t.source_type === 'invoice')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const vendorPayments = recentTransactions
    .filter(t => t.transaction_type === 'expense' && t.source_type === 'vendor')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue (30 days)"
          value={`₹${totalIncome.toLocaleString('en-IN')}`}
          icon={DollarSign}
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatCard
          title="Expenses (30 days)"
          value={`₹${totalExpense.toLocaleString('en-IN')}`}
          icon={AlertCircle}
          trend={{ value: -5, label: "vs last month" }}
        />
        <StatCard
          title="Net Profit (30 days)"
          value={`₹${netAmount.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          trend={{ value: 8, label: "vs last month" }}
        />
        <StatCard
          title="Client Invoices"
          value={`₹${invoicePayments.toLocaleString('en-IN')}`}
          icon={Users}
          trend={{ value: 2, label: "vs last month" }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.slice(0, 5).map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{transaction.description || "Unnamed Transaction"}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.transaction_date), "dd MMM yyyy")}
                    </p>
                  </div>
                  <p className={transaction.transaction_type === "income" ? "text-green-600" : "text-red-600"}>
                    {transaction.transaction_type === "income" ? "+" : "-"} ₹{Number(transaction.amount).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent transactions found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Link to="/invoices">
                <Button variant="outline" className="w-full justify-start">
                  <Receipt className="h-4 w-4 mr-2" />
                  Generate Invoice
                </Button>
              </Link>
              <Link to="/finances">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Record Transaction
                </Button>
              </Link>
              <Link to="/finances/categories">
                <Button variant="outline" className="w-full justify-start">
                  <Store className="h-4 w-4 mr-2" />
                  Manage Categories
                </Button>
              </Link>
              <Link to="/finances?tab=reports">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Financial Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
