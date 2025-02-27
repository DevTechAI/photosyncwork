
import React from "react";
import { User, FileText, Receipt, ChartBar } from "lucide-react";
import { StatCard } from "@/components/stats/StatCard";

export function ClientStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Clients"
        value="24"
        icon={User}
        trend={{ value: 3, label: "this month" }}
      />
      <StatCard
        title="Active Projects"
        value="8"
        icon={FileText}
        trend={{ value: 2, label: "vs last month" }}
      />
      <StatCard
        title="Pending Invoices"
        value="5"
        icon={Receipt}
        trend={{ value: -1, label: "vs last month" }}
      />
      <StatCard
        title="Completed Projects"
        value="16"
        icon={ChartBar}
        trend={{ value: 4, label: "this month" }}
      />
    </div>
  );
}
