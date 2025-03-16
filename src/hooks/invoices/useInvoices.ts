
import { useState, useEffect } from "react";
import { Invoice } from "@/components/invoices/types";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export function useInvoices() {
  const [sortBy, setSortBy] = useState<"date" | "amount" | "balanceHighToLow" | "balanceLowToHigh">("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [processedEstimateIds, setProcessedEstimateIds] = useState<string[]>([]);
  const location = useLocation();
  const { toast } = useToast();

  // Load invoices from localStorage on component mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem("invoices");
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
  }, []);

  // Extract processed estimate IDs from invoices
  useEffect(() => {
    const estimateIds = invoices
      .filter(invoice => invoice.estimateId)
      .map(invoice => invoice.estimateId as string);
    
    setProcessedEstimateIds([...new Set(estimateIds)]);
  }, [invoices]);

  // Handle estimate data passed through navigation state
  useEffect(() => {
    if (location.state?.fromEstimate) {
      const estimateData = location.state.fromEstimate;
      
      // Check if an invoice already exists for this estimate
      if (estimateData.id && processedEstimateIds.includes(estimateData.id)) {
        toast({
          title: "Invoice Already Exists",
          description: `An invoice for this estimate has already been created.`,
          variant: "destructive"
        });
        return;
      }
      
      // Open the invoice form and pre-fill with estimate data
      setShowNewInvoice(true);
      
      // Notify user
      toast({
        title: "Estimate Data Loaded",
        description: `Creating invoice for ${estimateData.clientName}`,
      });
    }
  }, [location, toast, processedEstimateIds]);

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
      const matchesStatus = !statusFilter || invoice.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
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

  // Check if an estimate already has an invoice
  const hasInvoiceForEstimate = (estimateId: string) => {
    return processedEstimateIds.includes(estimateId);
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
    locationState: location.state,
    hasInvoiceForEstimate
  };
}
