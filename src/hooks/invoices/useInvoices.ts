
import { useState } from "react";

export function useInvoices() {
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Mock invoices array - empty for now
  const mockInvoices: any[] = [];

  // Filter and sort invoices
  const filteredInvoices = mockInvoices
    .filter((invoice: any) => {
      const matchesSearch = invoice?.client
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || invoice?.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return parseInt(b.amount.replace(/[₹,]/g, "")) - parseInt(a.amount.replace(/[₹,]/g, ""));
    });

  return {
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    showNewInvoice,
    setShowNewInvoice,
    selectedInvoice,
    setSelectedInvoice,
    filteredInvoices
  };
}
