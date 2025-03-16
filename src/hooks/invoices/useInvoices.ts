
import { useState, useEffect } from "react";
import { Invoice } from "@/components/invoices/types";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useInvoices() {
  const [sortBy, setSortBy] = useState<"date" | "amount" | "balanceHighToLow" | "balanceLowToHigh">("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [processedEstimateIds, setProcessedEstimateIds] = useState<string[]>([]);
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch invoices from Supabase
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*');
      
      if (error) {
        console.error("Error fetching invoices:", error);
        toast({
          title: "Error",
          description: "Failed to load invoices",
          variant: "destructive"
        });
        return [];
      }
      
      // Map database column names to our Invoice type
      return data.map(item => ({
        id: item.id,
        client: item.client,
        clientEmail: item.client_email,
        date: item.date,
        amount: item.amount,
        paidAmount: item.paid_amount,
        balanceAmount: item.balance_amount,
        status: item.status,
        items: item.items,
        estimateId: item.estimate_id,
        notes: item.notes,
        paymentDate: item.payment_date,
        paymentMethod: item.payment_method,
        gstRate: item.gst_rate
      })) as Invoice[];
    }
  });

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

  // Add invoice mutation
  const addInvoiceMutation = useMutation({
    mutationFn: async (invoice: Invoice) => {
      // Convert Invoice type to database structure
      const dbInvoice = {
        id: invoice.id,
        client: invoice.client,
        client_email: invoice.clientEmail,
        date: invoice.date,
        amount: invoice.amount,
        paid_amount: invoice.paidAmount,
        balance_amount: invoice.balanceAmount,
        status: invoice.status,
        items: invoice.items,
        estimate_id: invoice.estimateId,
        notes: invoice.notes,
        payment_date: invoice.paymentDate,
        payment_method: invoice.paymentMethod,
        gst_rate: invoice.gstRate
      };
      
      const { data, error } = await supabase
        .from('invoices')
        .insert(dbInvoice)
        .select()
        .single();
        
      if (error) {
        console.error("Error adding invoice:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error) => {
      console.error("Failed to add invoice:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive"
      });
    }
  });

  // Update invoice mutation
  const updateInvoiceMutation = useMutation({
    mutationFn: async (updatedInvoice: Invoice) => {
      // Convert Invoice type to database structure
      const dbInvoice = {
        client: updatedInvoice.client,
        client_email: updatedInvoice.clientEmail,
        date: updatedInvoice.date,
        amount: updatedInvoice.amount,
        paid_amount: updatedInvoice.paidAmount,
        balance_amount: updatedInvoice.balanceAmount,
        status: updatedInvoice.status,
        items: updatedInvoice.items,
        estimate_id: updatedInvoice.estimateId,
        notes: updatedInvoice.notes,
        payment_date: updatedInvoice.paymentDate,
        payment_method: updatedInvoice.paymentMethod,
        gst_rate: updatedInvoice.gstRate
      };
      
      const { data, error } = await supabase
        .from('invoices')
        .update(dbInvoice)
        .eq('id', updatedInvoice.id)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating invoice:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error) => {
      console.error("Failed to update invoice:", error);
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive"
      });
    }
  });

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
    addInvoiceMutation.mutate(invoice, {
      onSuccess: () => {
        toast({
          title: "Invoice Created",
          description: `Invoice for ${invoice.client} has been created successfully.`,
        });
      }
    });
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    updateInvoiceMutation.mutate(updatedInvoice, {
      onSuccess: () => {
        toast({
          title: "Invoice Updated",
          description: `Invoice for ${updatedInvoice.client} has been updated.`,
        });
      }
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
    hasInvoiceForEstimate,
    isLoading
  };
}
