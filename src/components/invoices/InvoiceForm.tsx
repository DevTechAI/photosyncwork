
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientDetailsCard } from "./components/ClientDetailsCard";
import { InvoiceItemsCard } from "./components/InvoiceItemsCard";
import { TotalCard } from "./components/TotalCard";
import { PaymentTrackingCard } from "./components/PaymentTrackingCard";
import { useLocation } from "react-router-dom";
import { InvoiceFormProps } from "./types/formTypes";
import { useInvoiceForm } from "@/hooks/invoices/useInvoiceForm";

export function InvoiceForm({ open, onClose, onSave, editingInvoice }: InvoiceFormProps) {
  const location = useLocation();
  const estimateData = location.state?.fromEstimate;
  
  const {
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
  } = useInvoiceForm(editingInvoice, estimateData);

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    const success = handleSubmit(event, onSave);
    if (success) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingInvoice ? "Edit" : "Create New"} {clientDetails.invoiceType === "proforma" ? "Proforma" : "Paid"} Invoice
          </DialogTitle>
          <DialogDescription>
            {editingInvoice ? "Update" : "Create a new"} {clientDetails.invoiceType.toLowerCase()} invoice for your photography services.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={submitForm}>
          <ClientDetailsCard 
            {...clientDetails}
            onInvoiceTypeChange={(value) => updateClientDetail('invoiceType', value)}
            onPaymentReceivedChange={(value) => updateClientDetail('paymentReceived', value)}
            onPaymentDateChange={(value) => updateClientDetail('paymentDate', value)}
            onPaymentMethodChange={(value) => updateClientDetail('paymentMethod', value)}
            onClientNameChange={(value) => updateClientDetail('clientName', value)}
            onClientEmailChange={(value) => updateClientDetail('clientEmail', value)}
            onClientPhoneChange={(value) => updateClientDetail('clientPhone', value)}
            onClientAddressChange={(value) => updateClientDetail('clientAddress', value)}
            onClientGstChange={(value) => updateClientDetail('clientGst', value)}
            onCompanyNameChange={(value) => updateClientDetail('companyName', value)}
            onCompanyEmailChange={(value) => updateClientDetail('companyEmail', value)}
            onCompanyPhoneChange={(value) => updateClientDetail('companyPhone', value)}
            onCompanyAddressChange={(value) => updateClientDetail('companyAddress', value)}
            onCompanyGstChange={(value) => updateClientDetail('companyGst', value)}
            onInvoiceDateChange={(value) => updateClientDetail('invoiceDate', value)}
          />
          
          <InvoiceItemsCard items={items} onItemsChange={setItems} />
          
          {clientDetails.invoiceType === "paid" ? (
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
              {editingInvoice ? "Update" : "Create"} {clientDetails.invoiceType === "proforma" ? "Proforma" : "Paid"} Invoice
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
