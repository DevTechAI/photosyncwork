
import { Invoice } from "@/components/invoices/types";

export type SortOption = "date" | "amount" | "balanceHighToLow" | "balanceLowToHigh";

// Filter invoices by search query and status
export const filterInvoices = (
  invoices: Invoice[],
  searchQuery: string,
  statusFilter: string | null
): Invoice[] => {
  return invoices.filter((invoice) => {
    const matchesSearch = invoice.client
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || invoice.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });
};

// Sort invoices by the specified criteria
export const sortInvoices = (invoices: Invoice[], sortBy: SortOption): Invoice[] => {
  return [...invoices].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "amount") {
      return parseInt(b.amount.replace(/[₹,]/g, "")) - parseInt(a.amount.replace(/[₹,]/g, ""));
    } else if (sortBy === "balanceHighToLow") {
      return parseInt(b.balanceAmount.replace(/[₹,]/g, "")) - parseInt(a.balanceAmount.replace(/[₹,]/g, ""));
    } else if (sortBy === "balanceLowToHigh") {
      return parseInt(a.balanceAmount.replace(/[₹,]/g, "")) - parseInt(b.balanceAmount.replace(/[₹,]/g, ""));
    }
    return 0;
  });
};
