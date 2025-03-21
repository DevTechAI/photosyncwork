
import { useState } from 'react';
import { addTransaction } from './api/transactionApi';
import { toast } from 'sonner';
import { fetchCategories } from './api/categoryApi';
import { useQuery } from '@tanstack/react-query';

export const useInvoicePaymentTransaction = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get "Client Payments" category for recording invoice payments
  const { data: categories } = useQuery({
    queryKey: ['financeCategories'],
    queryFn: fetchCategories
  });
  
  const recordPaymentAsTransaction = async (paymentData: {
    invoiceId: string;
    clientName: string;
    amount: number;
    paymentDate: string;
    paymentMethod?: string;
    description?: string;
  }) => {
    try {
      setIsProcessing(true);
      
      // Find the Client Payments category
      const clientPaymentsCategory = categories?.find(
        c => c.name === 'Client Payments' && c.type === 'income'
      );
      
      if (!clientPaymentsCategory) {
        console.error("Client Payments category not found");
        toast.error("Could not find Client Payments category. Payment recorded but not added to transactions.");
        return null;
      }
      
      // Create the transaction
      const transaction = await addTransaction({
        transaction_type: 'income',
        category_id: clientPaymentsCategory.id,
        amount: paymentData.amount,
        transaction_date: paymentData.paymentDate,
        description: paymentData.description || `Payment from ${paymentData.clientName}`,
        payment_method: paymentData.paymentMethod || 'none',
        source_id: paymentData.invoiceId,
        source_type: 'invoice'
      });
      
      toast.success("Payment successfully recorded as a transaction");
      return transaction;
      
    } catch (error) {
      console.error("Error recording payment as transaction:", error);
      toast.error("Failed to record payment as transaction");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    recordPaymentAsTransaction,
    isProcessing
  };
};
