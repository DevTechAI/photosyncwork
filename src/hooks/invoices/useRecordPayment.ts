
import { useState, useEffect } from "react";
import { Invoice } from "@/components/invoices/types";
import { toast } from "sonner";

export function useRecordPayment(invoice: Invoice, onSave: (invoice: Invoice) => void, onClose: () => void) {
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentAmount, setPaymentAmount] = useState<string>(invoice.balanceAmount || "");
  const [paymentMethod, setPaymentMethod] = useState<string>("bank");
  const [collectedBy, setCollectedBy] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");

  // Get max allowed payment (balance amount)
  const maxAllowedPayment = parseFloat(invoice.balanceAmount.replace(/[₹,]/g, "")) || 0;

  // Update payment amount when invoice changes
  useEffect(() => {
    setPaymentAmount(invoice.balanceAmount.replace(/[₹,]/g, "") || "");
    setPaymentMethod(invoice.paymentMethod || "bank");
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setCollectedBy("");
  }, [invoice]);

  // Validate payment amount when it changes
  const handlePaymentAmountChange = (value: string) => {
    setPaymentAmount(value);
    validatePaymentAmount(value);
  };

  // Validate payment amount
  const validatePaymentAmount = (value: string) => {
    const cleanValue = value.replace(/[₹,]/g, "");
    const numValue = parseFloat(cleanValue) || 0;

    if (numValue <= 0) {
      setAmountError("Payment amount must be greater than zero");
      return false;
    }

    if (numValue > maxAllowedPayment) {
      setAmountError(`Payment cannot exceed balance (₹${maxAllowedPayment.toLocaleString('en-IN')})`);
      return false;
    }

    setAmountError("");
    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validation
    if (!paymentDate) {
      toast.error("Please select a payment date");
      return;
    }
    
    if (!paymentAmount) {
      toast.error("Please enter a payment amount");
      return;
    }

    // Validate payment amount
    if (!validatePaymentAmount(paymentAmount)) {
      return;
    }
    
    // Convert amounts to numbers for calculation
    const currentPaid = parseFloat(invoice.paidAmount.replace(/[₹,]/g, "")) || 0;
    const newPayment = parseFloat(paymentAmount.replace(/[₹,]/g, "")) || 0;
    const totalAmount = parseFloat(invoice.amount.replace(/[₹,]/g, "")) || 0;
    
    // Calculate new paid amount and balance
    const updatedPaidAmount = (currentPaid + newPayment).toString();
    const updatedBalanceAmount = Math.max(0, totalAmount - (currentPaid + newPayment)).toString();
    
    // Determine status based on payment
    const updatedStatus = 
      currentPaid + newPayment >= totalAmount 
        ? "paid" 
        : currentPaid + newPayment > 0 
          ? "partial" 
          : "pending";
    
    // Create updated invoice object
    const updatedInvoice: Invoice = {
      ...invoice,
      paidAmount: updatedPaidAmount,
      balanceAmount: updatedBalanceAmount,
      status: updatedStatus,
      paymentDate: paymentDate,
      paymentMethod: paymentMethod,
      notes: invoice.notes 
        ? `${invoice.notes}\n${new Date().toLocaleDateString()}: Payment of ₹${parseFloat(paymentAmount).toLocaleString('en-IN')} collected by ${collectedBy || 'staff'}`
        : `${new Date().toLocaleDateString()}: Payment of ₹${parseFloat(paymentAmount).toLocaleString('en-IN')} collected by ${collectedBy || 'staff'}`
    };
    
    onSave(updatedInvoice);
    onClose();
    
    toast.success("Payment recorded successfully");
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
}
