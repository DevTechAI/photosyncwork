
import { useState } from "react";
import { Invoice } from "@/components/invoices/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface InvoicePaymentData {
  invoiceId: string;
  clientName: string;
  amount: number;
  paymentDate: Date;
  paymentMethod?: string;
  description?: string;
}

type RecordPaymentFn = (paymentData: InvoicePaymentData) => Promise<any>;

export const useRecordPayment = (
  invoice: Invoice, 
  onSave: (invoice: Invoice) => void, 
  onClose: () => void,
  recordPaymentAsTransaction?: RecordPaymentFn
) => {
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [paymentAmount, setPaymentAmount] = useState<string>(
    Math.max(0, invoice.balance).toFixed(2)
  );
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [collectedBy, setCollectedBy] = useState<string>("self");
  const [amountError, setAmountError] = useState<string>("");

  const maxAllowedPayment = invoice.balance;

  const handlePaymentAmountChange = (value: string) => {
    setPaymentAmount(value);

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setAmountError("Please enter a valid amount");
    } else if (numValue <= 0) {
      setAmountError("Amount must be greater than zero");
    } else if (numValue > maxAllowedPayment) {
      setAmountError(`Amount cannot exceed the remaining balance (${maxAllowedPayment})`);
    } else {
      setAmountError("");
    }
  };

  const handleSubmit = async () => {
    try {
      const amount = parseFloat(paymentAmount);
      
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid payment amount");
        return;
      }
      
      if (amount > maxAllowedPayment) {
        toast.error(`Payment amount cannot exceed the remaining balance (${maxAllowedPayment})`);
        return;
      }

      // Update the invoice's payment history
      const paymentId = crypto.randomUUID();
      const payment = {
        id: paymentId,
        date: paymentDate.toISOString().split('T')[0],
        amount: amount,
        method: paymentMethod,
        collected_by: collectedBy
      };

      const updatedPayments = [...(invoice.payments || []), payment];
      const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
      const newBalance = invoice.total - totalPaid;
      const newStatus = newBalance <= 0 ? "paid" : "partial";

      const { data, error } = await supabase
        .from("invoices")
        .update({
          payments: updatedPayments,
          status: newStatus,
          paid_amount: totalPaid,
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq("id", invoice.id)
        .select()
        .single();

      if (error) {
        console.error("Error recording payment:", error);
        toast.error("Failed to record payment");
        return false;
      }

      // If we have a transaction recorder function, use it
      if (recordPaymentAsTransaction) {
        const paymentData: InvoicePaymentData = {
          invoiceId: invoice.id,
          clientName: invoice.client,
          amount: amount,
          paymentDate,
          paymentMethod,
          description: `Payment for Invoice #${invoice.id.slice(0, 8)}`
        };
        
        await recordPaymentAsTransaction(paymentData);
      }

      toast.success("Payment recorded successfully");
      onSave(data);
      onClose();
      return true;
    } catch (error) {
      console.error("Error in payment submission:", error);
      toast.error("An error occurred while recording the payment");
      return false;
    }
  };

  return {
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
  };
};
