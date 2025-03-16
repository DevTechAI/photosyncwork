
import { useState, useEffect } from "react";
import { Invoice } from "@/components/invoices/types";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export function useInvoices() {
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const location = useLocation();
  const { toast } = useToast();

  // Load invoices from localStorage on component mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem("invoices");
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
  }, []);

  // Handle estimate data passed through navigation state
  useEffect(() => {
    if (location.state?.fromEstimate) {
      const estimateData = location.state.fromEstimate;
      
      // Open the invoice form and pre-fill with estimate data
      setShowNewInvoice(true);
      
      // Notify user
      toast({
        title: "Estimate Data Loaded",
        description: `Creating invoice for ${estimateData.clientName}`,
      });
    }
  }, [location, toast]);

  // Save invoices to localStorage whenever the invoices array changes
  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  // Filter and sort invoices
  const filteredInvoices = invoices
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

  const addInvoice = (invoice: Invoice) => {
    // Generate a unique ID if not provided
    if (!invoice.id) {
      invoice.id = Math.floor(Math.random() * 100000).toString();
    }
    
    setInvoices((prevInvoices) => [invoice, ...prevInvoices]);
    
    toast({
      title: "Invoice Created",
      description: `Invoice for ${invoice.client} has been created successfully.`,
    });
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
    
    toast({
      title: "Invoice Updated",
      description: `Invoice for ${updatedInvoice.client} has been updated.`,
    });
  };

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
    filteredInvoices,
    addInvoice,
    updateInvoice,
    locationState: location.state
  };
}
