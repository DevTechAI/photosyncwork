
import { DollarSign, AlertCircle, Clock, FileText, Receipt, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stats/StatCard";

export function FinancesTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="₹2,48,000"
          icon={DollarSign}
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatCard
          title="Outstanding"
          value="₹88,000"
          icon={AlertCircle}
          trend={{ value: -5, label: "vs last month" }}
        />
        <StatCard
          title="Upcoming Payments"
          value="₹1,25,000"
          icon={Clock}
          trend={{ value: 8, label: "vs last month" }}
        />
        <StatCard
          title="Active Estimates"
          value="12"
          icon={FileText}
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
              {[
                { client: "Sharma Wedding", amount: "₹45,000", type: "income", date: "May 15" },
                { client: "Equipment Purchase", amount: "₹28,000", type: "expense", date: "May 14" },
                { client: "Corporate Event", amount: "₹35,000", type: "income", date: "May 12" }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{transaction.client}</h4>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                  <p className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                    {transaction.type === "income" ? "+" : "-"} {transaction.amount}
                  </p>
                </div>
              ))}
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
              <Link to="/expenses">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Record Expense
                </Button>
              </Link>
              <Link to="/reports">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
