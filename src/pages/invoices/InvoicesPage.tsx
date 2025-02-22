
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Receipt, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";

// Temporary mock data
const mockInvoices = [
  {
    id: "INV-001",
    client: "Sharma Wedding",
    date: "2024-03-15",
    amount: "₹45,000",
    status: "Paid",
  },
  {
    id: "INV-002",
    client: "Corporate Event - TechCo",
    date: "2024-03-18",
    amount: "₹85,000",
    status: "Pending",
  },
  {
    id: "INV-003",
    client: "Birthday Photoshoot",
    date: "2024-03-20",
    amount: "₹15,000",
    status: "Draft",
  },
];

export default function InvoicesPage() {
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground mt-2">
              Manage your client invoices and payments
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Total Outstanding
            </p>
            <h3 className="text-2xl font-semibold mt-2">₹85,000</h3>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Paid this Month
            </p>
            <h3 className="text-2xl font-semibold mt-2">₹45,000</h3>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Draft Invoices
            </p>
            <h3 className="text-2xl font-semibold mt-2">₹15,000</h3>
          </Card>
        </div>

        {/* Invoices List */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Invoices</h2>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort by {sortBy === "date" ? "Amount" : "Date"}
              </Button>
            </div>
            <div className="divide-y">
              {mockInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.client}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.id} · {invoice.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{invoice.amount}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.status}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
