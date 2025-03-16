
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { ClientDetailsCard } from "./components/ClientDetailsCard";
import { InvoiceItemsCard } from "./components/InvoiceItemsCard";
import { TotalCard } from "./components/TotalCard";
import { PaymentTrackingCard } from "./components/PaymentTrackingCard";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { Invoice, InvoiceItem } from "./types";
import { InvoiceFormProps } from "./types/formTypes";

export function InvoiceForm({ open, onClose, onSave, editingInvoice }: InvoiceFormProps) {
  const location = useLocation();
  const estimateData = location.state?.fromEstimate;
  
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientGst, setClientGst] = useState("");
  
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyGst, setCompanyGst] = useState("");
  
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceType, setInvoiceType] = useState<"proforma" | "paid">("proforma");
  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", amount: "" }]);
  const [gstRate, setGstRate] = useState("18");
  
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("bank");
  
  const [amount, setAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("0");
  const [balanceAmount, setBalanceAmount] = useState("0");
  const [notes, setNotes] = useState("");

  // Pre-fill from estimate or editing invoice
  useEffect(() => {
    if (estimateData) {
      setClientName(estimateData.clientName || "");
      setClientEmail(estimateData.clientEmail || "");
      
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
      setClientName(editingInvoice.client || "");
      setClientEmail(editingInvoice.clientEmail || "");
      setInvoiceDate(editingInvoice.date || new Date().toISOString().split('T')[0]);
      setItems(editingInvoice.items || [{ description: "", amount: "" }]);
      setGstRate(editingInvoice.gstRate || "18");
      setInvoiceType(editingInvoice.status === "pending" ? "proforma" : "paid");
      setPaymentReceived(editingInvoice.status === "paid");
      setPaymentDate(editingInvoice.paymentDate || "");
      setPaymentMethod(editingInvoice.paymentMethod || "bank");
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

  const calculateTotal = () => {
    let total = 0;
    items.forEach(item => {
      total += parseFloat(item.amount.replace(/[₹,]/g, "")) || 0;
    });
    
    // If paid invoice, add GST
    if (invoiceType === "paid") {
      const gstAmount = (total * (parseFloat(gstRate) / 100)) || 0;
      total += gstAmount;
    }
    
    return total.toString();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validation
    if (items.some(item => !item.description || !item.amount)) {
      toast.error("Please fill in all invoice items");
      return;
    }
    
    if (!clientName) {
      toast.error("Please enter client name");
      return;
    }
    
    const finalAmount = amount || calculateTotal();
    const status = paymentReceived 
      ? "paid" 
      : parseFloat(paidAmount) > 0 
        ? "partial" 
        : "pending";
    
    const newInvoice: Invoice = {
      id: editingInvoice?.id || Math.floor(Math.random() * 100000).toString(),
      client: clientName,
      clientEmail,
      date: invoiceDate,
      amount: finalAmount,
      paidAmount,
      balanceAmount,
      status,
      items,
      estimateId: estimateData?.id,
      notes,
      paymentDate: paymentReceived ? paymentDate : undefined,
      paymentMethod: paymentReceived ? paymentMethod : undefined,
      gstRate: invoiceType === "paid" ? gstRate : "0"
    };
    
    onSave(newInvoice);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingInvoice ? "Edit" : "Create New"} {invoiceType === "proforma" ? "Proforma" : "Paid"} Invoice
          </DialogTitle>
          <DialogDescription>
            {editingInvoice ? "Update" : "Create a new"} {invoiceType.toLowerCase()} invoice for your photography services.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <ClientDetailsCard 
            invoiceType={invoiceType}
            onInvoiceTypeChange={setInvoiceType}
            paymentReceived={paymentReceived}
            onPaymentReceivedChange={setPaymentReceived}
            paymentDate={paymentDate}
            onPaymentDateChange={setPaymentDate}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            clientName={clientName}
            onClientNameChange={setClientName}
            clientEmail={clientEmail}
            onClientEmailChange={setClientEmail}
            clientPhone={clientPhone}
            onClientPhoneChange={setClientPhone}
            clientAddress={clientAddress}
            onClientAddressChange={setClientAddress}
            clientGst={clientGst}
            onClientGstChange={setClientGst}
            companyName={companyName}
            onCompanyNameChange={setCompanyName}
            companyEmail={companyEmail}
            onCompanyEmailChange={setCompanyEmail}
            companyPhone={companyPhone}
            onCompanyPhoneChange={setCompanyPhone}
            companyAddress={companyAddress}
            onCompanyAddressChange={setCompanyAddress}
            companyGst={companyGst}
            onCompanyGstChange={setCompanyGst}
            invoiceDate={invoiceDate}
            onInvoiceDateChange={setInvoiceDate}
          />
          
          <InvoiceItemsCard items={items} onItemsChange={setItems} />
          
          {invoiceType === "paid" ? (
            <TotalCard
              items={items}
              gstRate={gstRate}
              onGstRateChange={setGstRate}
            />
          ) : (
            <TotalCard
              items={items}
              gstRate="0"
              onGstRateChange={() => {}}
              hideGst
            />
          )}
          
          {/* Payment Tracking Card */}
          <PaymentTrackingCard
            amount={amount || calculateTotal()}
            onAmountChange={setAmount}
            paidAmount={paidAmount}
            onPaidAmountChange={setPaidAmount}
            balanceAmount={balanceAmount}
            notes={notes}
            onNotesChange={setNotes}
          />
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingInvoice ? "Update" : "Create"} {invoiceType === "proforma" ? "Proforma" : "Paid"} Invoice
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
