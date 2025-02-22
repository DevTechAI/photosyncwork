
import Layout from "@/components/Layout";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { InvoiceDetails } from "@/components/invoices/InvoiceDetails";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Receipt,
  ArrowUpDown,
  MoreHorizontal,
  Search,
  Filter,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof mockInvoices[0] | null>(null);

  // Filter and sort invoices
  const filteredInvoices = mockInvoices
    .filter((invoice) => {
      const matchesSearch = invoice.client
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return parseInt(b.amount.replace(/[₹,]/g, "")) - parseInt(a.amount.replace(/[₹,]/g, ""));
    });

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
          <Button className="gap-2" onClick={() => setShowNewInvoice(true)}>
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

        {/* Search and Filter Bar */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {statusFilter || "All Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Paid")}>
                Paid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Draft")}>
                Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Invoices List */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Invoices</h2>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() =>
                  setSortBy(sortBy === "date" ? "amount" : "date")
                }
              >
                <ArrowUpDown className="h-4 w-4" />
                Sort by {sortBy === "date" ? "Amount" : "Date"}
              </Button>
            </div>
            <div className="divide-y">
              {filteredInvoices.map((invoice) => (
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedInvoice(invoice)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Invoice</DropdownMenuItem>
                        <DropdownMenuItem>Download PDF</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <InvoiceForm open={showNewInvoice} onClose={() => setShowNewInvoice(false)} />
      <InvoiceDetails
        invoice={selectedInvoice}
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </Layout>
  );
}
