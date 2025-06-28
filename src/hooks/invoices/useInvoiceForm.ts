import { useState, useEffect } from "react";
import { Invoice, InvoiceItem } from "@/components/invoices/types";
import { ClientDetailsFormState } from "@/components/invoices/types/formTypes";
import { toast } from "sonner";
import { z } from "zod";

// Define validation schema
const invoiceSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  items: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      amount: z.string().min(1, "Amount is required")
    })
  ).min(1, "At least one item is required"),
});

export function useInvoiceForm(editingInvoice?: Invoice | null, estimateData?: any) {
  // Client Details State
  const [clientDetails, setClientDetails] = useState<ClientDetailsFormState>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    clientGst: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    companyGst: "",
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceType: "proforma",
    paymentReceived: false,
    paymentDate: "",
    paymentMethod: "bank"
  });

  // Invoice Items & Calculation State
  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", amount: "" }]);
  const [gstRate, setGstRate] = useState("18");
  const [amount, setAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("0");
  const [balanceAmount, setBalanceAmount] = useState("0");
  const [notes, setNotes] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Pre-fill from estimate or editing invoice
  useEffect(() => {
    if (estimateData) {
      setClientDetails(prevState => ({
        ...prevState,
        clientName: estimateData.clientName || "",
        clientEmail: estimateData.clientEmail || ""
      }));
      
      // Create items based on package selection
      const selectedPackage = estimateData.packages && estimateData.packages[estimateData.selectedPackageIndex || 0];
      
      if (selectedPackage) {
        const newItems: InvoiceItem[] = [];
        
        // Add selected package as an item
        newItems.push({
          description: `Photography Package: ${selectedPackage.name || 'Option ' + (estimateData.selectedPackageIndex + 1)}`,
          amount: selectedPackage.amount
        });
        
        setItems(newItems);
        setAmount(selectedPackage.amount);
        setBalanceAmount(selectedPackage.amount);
      }
    } else if (editingInvoice) {
      // Fill form with editing invoice data
      const isPaid = editingInvoice.status === "paid";
      const isPartial = editingInvoice.status === "partial";
      
      setClientDetails(prevState => ({
        ...prevState,
        clientName: editingInvoice.client || "",
        clientEmail: editingInvoice.clientEmail || "",
        invoiceDate: editingInvoice.date || new Date().toISOString().split('T')[0],
        invoiceType: editingInvoice.status === "pending" ? "proforma" : "paid",
        paymentReceived: isPaid,
        paymentDate: editingInvoice.paymentDate || "",
        paymentMethod: editingInvoice.paymentMethod || "bank"
      }));
      
      setItems(editingInvoice.items || [{ description: "", amount: "" }]);
      setGstRate(editingInvoice.gstRate || "18");
      setAmount(editingInvoice.amount || "");
      setPaidAmount(editingInvoice.paidAmount || "0");
      setBalanceAmount(editingInvoice.balanceAmount || "0");
      setNotes(editingInvoice.notes || "");
    }
  }, [estimateData, editingInvoice]);

  // Calculate balance whenever amount or paidAmount changes
  useEffect(() => {
    if (amount && paidAmount) {
      const total = parseFloat(amount.replace(/[₹,]/g, "")) || 0;
      const paid = parseFloat(paidAmount.replace(/[₹,]/g, "")) || 0;
      const balance = Math.max(0, total - paid);
      setBalanceAmount(balance.toString());
    }
  }, [amount, paidAmount]);

  // Calculate total from items
  const calculateTotal = () => {
    let total = 0;
    items.forEach(item => {
      total += parseFloat(item.amount.replace(/[₹,]/g, "")) || 0;
    });
    
    // If paid invoice, add GST
    if (clientDetails.invoiceType === "paid") {
      const gstAmount = (total * (parseFloat(gstRate) / 100)) || 0;
      total += gstAmount;
    }
    
    return total.toString();
  };

  // Update client details field
  const updateClientDetail = (field: keyof ClientDetailsFormState, value: string | boolean) => {
    setClientDetails(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when field is updated
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    try {
      // Validate using Zod schema
      invoiceSchema.parse({
        clientName: clientDetails.clientName,
        clientEmail: clientDetails.clientEmail,
        invoiceDate: clientDetails.invoiceDate,
        items
      });
      
      // Additional validations not covered by schema
      if (items.some(item => isNaN(parseFloat(item.amount.replace(/[₹,]/g, ""))))) {
        errors.items = "All item amounts must be valid numbers";
      }
      
      if (clientDetails.invoiceType === "paid" && clientDetails.paymentReceived) {
        if (!clientDetails.paymentDate) {
          errors.paymentDate = "Payment date is required when payment is received";
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>, onSave: (invoice: Invoice) => void) => {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting");
      return false;
    }
    
    const finalAmount = amount || calculateTotal();
    
    // Determine status from amount values, not just from form state
    const paidAmountValue = parseFloat(paidAmount.replace(/[₹,]/g, "")) || 0;
    const totalAmountValue = parseFloat(finalAmount.replace(/[₹,]/g, "")) || 0;
    
    let status: "pending" | "partial" | "paid";
    
    if (paidAmountValue >= totalAmountValue) {
      status = "paid";
    } else if (paidAmountValue > 0) {
      status = "partial";
    } else {
      status = "pending";
    }
    
    const newInvoice: Invoice = {
      id: editingInvoice?.id || "",  // For new invoices, the ID will be generated by Supabase
      client: clientDetails.clientName,
      clientEmail: clientDetails.clientEmail,
      date: clientDetails.invoiceDate,
      amount: finalAmount,
      paidAmount,
      balanceAmount,
      status,
      items,
      estimateId: estimateData?.id,
      notes,
      paymentDate: paidAmountValue > 0 ? (editingInvoice?.paymentDate || clientDetails.paymentDate) : undefined,
      paymentMethod: paidAmountValue > 0 ? (editingInvoice?.paymentMethod || clientDetails.paymentMethod) : undefined,
      gstRate: clientDetails.invoiceType === "paid" ? gstRate : "0"
    };
    
    onSave(newInvoice);
    return true;
  };

  return {
    clientDetails,
    updateClientDetail,
    items,
    setItems,
    gstRate,
    setGstRate,
    amount,
    setAmount,
    paidAmount,
    setPaidAmount,
    balanceAmount,
    notes,
    setNotes,
    calculateTotal,
    handleSubmit,
    validationErrors
  };
}