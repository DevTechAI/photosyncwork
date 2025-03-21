
import { useState } from "react";
import { Invoice, InvoicePayment } from "@/components/invoices/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface InvoicePaymentData {
  invoiceId: string;
  clientName: string;
  amount: number;
  paymentDate: string;
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
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentAmount, setPaymentAmount] = useState<string>(
    Math.max(0, parseFloat(invoice.balanceAmount)).toFixed(2)
  );
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [collectedBy, setCollectedBy] = useState<string>("self");
  const [amountError, setAmountError] = useState<string>("");

  const maxAllowedPayment = parseFloat(invoice.balanceAmount);

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
        return false;
      }
      
      if (amount > maxAllowedPayment) {
        toast.error(`Payment amount cannot exceed the remaining balance (${maxAllowedPayment})`);
        return false;
      }

      // Update the invoice's payment history
      const paymentId = crypto.randomUUID();
      const payment: InvoicePayment = {
        id: paymentId,
        date: paymentDate,
        amount: amount,
        method: paymentMethod,
        collected_by: collectedBy
      };

      const existingPayments = invoice.payments || [];
      const updatedPayments = [...existingPayments, payment];
      const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
      const invoiceAmount = parseFloat(invoice.amount);
      const newBalance = invoiceAmount - totalPaid;
      const newStatus = newBalance <= 0 ? "paid" : "partial";

      // Convert payments to plain objects for Supabase storage
      const paymentsForDb = updatedPayments.map(p => ({
        id: p.id,
        date: p.date,
        amount: p.amount,
        method: p.method,
        collected_by: p.collected_by
      }));

      const { data, error } = await supabase
        .from("invoices")
        .update({
          payments: paymentsForDb,
          status: newStatus,
          paid_amount: totalPaid.toString(),
          balance_amount: newBalance.toString(),
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
          description: `Payment for Invoice #${invoice.displayNumber || invoice.id.slice(0, 8)}`
        };
        
        await recordPaymentAsTransaction(paymentData);
      }

      // Convert DB invoice to our app's Invoice format
      const updatedInvoice: Invoice = {
        id: data.id,
        client: data.client,
        clientEmail: data.client_email,
        date: data.date,
        amount: data.amount,
        paidAmount: data.paid_amount || "0",
        balanceAmount: data.balance_amount,
        status: data.status as "pending" | "partial" | "paid",
        items: data.items as any,
        estimateId: data.estimate_id,
        notes: data.notes,
        paymentDate: data.payment_date,
        paymentMethod: data.payment_method,
        gstRate: data.gst_rate,
        payments: data.payments || [],
        displayNumber: data.display_number
      };

      toast.success("Payment recorded successfully");
      onSave(updatedInvoice);
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
