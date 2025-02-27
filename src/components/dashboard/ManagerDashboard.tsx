
import { DollarSign, FileText, Receipt, TrendingUp, AlertCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stats/StatCard";
import { RevenueChart } from "./RevenueChart";
import { UpcomingPayments } from "./UpcomingPayments";
import { QuickActions } from "./QuickActions";

export function ManagerDashboard() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Financial Overview</h1>
        <p className="text-muted-foreground mt-2">
          Track your business performance and financial health
        </p>
      </div>

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

      <RevenueChart />

      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingPayments />
        <QuickActions />
      </div>
    </div>
  );
}
