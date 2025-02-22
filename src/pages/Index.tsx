
import Layout from "@/components/Layout";
import { StatCard } from "@/components/stats/StatCard";
import {
  DollarSign,
  FileText,
  Receipt,
  Users,
} from "lucide-react";

export default function Index() {
  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back to your photography business overview.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Monthly Revenue"
            value="$24,320"
            icon={DollarSign}
            trend={{ value: 12, label: "vs last month" }}
          />
          <StatCard
            title="Active Estimates"
            value="8"
            icon={FileText}
            trend={{ value: -2, label: "vs last month" }}
          />
          <StatCard
            title="Pending Invoices"
            value="5"
            icon={Receipt}
            trend={{ value: 0, label: "vs last month" }}
          />
          <StatCard
            title="Active Clients"
            value="24"
            icon={Users}
            trend={{ value: 4, label: "vs last month" }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Placeholder for future charts and activity feed */}
          <div className="glass-panel rounded-xl p-6 h-[400px]">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Coming soon: Monthly revenue breakdown
            </p>
          </div>
          
          <div className="glass-panel rounded-xl p-6 h-[400px]">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Coming soon: Latest estimates and invoices
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
