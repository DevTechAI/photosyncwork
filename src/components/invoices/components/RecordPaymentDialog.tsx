
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Invoice } from "../types";
import { useRecordPayment } from "@/hooks/invoices/useRecordPayment";
import { PaymentForm } from "./PaymentForm";
import { useInvoicePaymentTransaction } from "@/hooks/finances/useInvoicePaymentTransaction";

interface RecordPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
  invoice: Invoice;
}

export function RecordPaymentDialog({ 
  open, 
  onClose, 
  onSave, 
  invoice 
}: RecordPaymentDialogProps) {
  const { recordPaymentAsTransaction } = useInvoicePaymentTransaction();
  
  const {
    paymentDate,
    setPaymentDate,
    paymentAmount,
    handlePaymentAmountChange,
    paymentMethod,
    setPaymentMethod,
    collectedBy,
    setCollectedBy,
    amountError,
    maxAllowedPayment,
    handleSubmit
  } = useRecordPayment(invoice, onSave, onClose, recordPaymentAsTransaction);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a payment for invoice #{invoice.id.slice(0, 8)} for {invoice.client}
          </DialogDescription>
        </DialogHeader>
        
        <PaymentForm
          paymentDate={paymentDate}
          setPaymentDate={setPaymentDate}
          paymentAmount={paymentAmount}
          handlePaymentAmountChange={handlePaymentAmountChange}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          collectedBy={collectedBy}
          setCollectedBy={setCollectedBy}
          amountError={amountError}
          maxAllowedPayment={maxAllowedPayment}
          handleSubmit={handleSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
