
import { useState, useEffect } from "react";
import { Invoice, InvoiceItem } from "@/components/invoices/types";
import { ClientDetailsFormState } from "@/components/invoices/types/formTypes";
import { toast } from "sonner";

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
      setClientDetails(prevState => ({
        ...prevState,
        clientName: editingInvoice.client || "",
        clientEmail: editingInvoice.clientEmail || "",
        invoiceDate: editingInvoice.date || new Date().toISOString().split('T')[0],
        invoiceType: editingInvoice.status === "pending" ? "proforma" : "paid",
        paymentReceived: editingInvoice.status === "paid",
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
  };

  // Form submission handler
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>, onSave: (invoice: Invoice) => void) => {
    event.preventDefault();
    
    // Validation
    if (items.some(item => !item.description || !item.amount)) {
      toast.error("Please fill in all invoice items");
      return;
    }
    
    if (!clientDetails.clientName) {
      toast.error("Please enter client name");
      return;
    }
    
    const finalAmount = amount || calculateTotal();
    const status = clientDetails.paymentReceived 
      ? "paid" 
      : parseFloat(paidAmount) > 0 
        ? "partial" 
        : "pending";
    
    const newInvoice: Invoice = {
      id: editingInvoice?.id || Math.floor(Math.random() * 100000).toString(),
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
      paymentDate: clientDetails.paymentReceived ? clientDetails.paymentDate : undefined,
      paymentMethod: clientDetails.paymentReceived ? clientDetails.paymentMethod : undefined,
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
    handleSubmit
  };
}
