
import { useState, useEffect } from "react";
import { Invoice } from "@/components/invoices/types";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const useEstimateProcessing = (invoices: Invoice[]) => {
  const [processedEstimateIds, setProcessedEstimateIds] = useState<string[]>([]);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
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

  // Check if an estimate already has an invoice
  const hasInvoiceForEstimate = (estimateId: string) => {
    return processedEstimateIds.includes(estimateId);
  };

  return {
    processedEstimateIds,
    showNewInvoice,
    setShowNewInvoice,
    locationState: location.state,
    hasInvoiceForEstimate
  };
};
