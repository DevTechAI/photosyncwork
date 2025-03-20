
import { useState } from 'react';
import { addTransaction } from '@/hooks/finances/api/transactionApi';
import { fetchCategories } from '@/hooks/finances/api/categoryApi';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Invoice } from '@/components/invoices/types';
import { FinanceTransaction } from '@/hooks/finances/api/types';

export function useInvoicePaymentTransaction() {
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch income categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  // Find the "Client Payment" or similar income category
  const getClientPaymentCategory = () => {
    // First look for a category specifically for client payments
    const clientPaymentCategory = categories.find(
      cat => cat.type === 'income' && 
      (cat.name.toLowerCase().includes('client') || 
       cat.name.toLowerCase().includes('payment') || 
       cat.name.toLowerCase().includes('invoice'))
    );
    
    // If not found, just get any income category
    if (!clientPaymentCategory) {
      return categories.find(cat => cat.type === 'income')?.id;
    }
    
    return clientPaymentCategory.id;
  };

  const recordPaymentAsTransaction = async (
    invoice: Invoice, 
    paymentAmount: number,
    paymentMethod: string,
    paymentDate: string
  ) => {
    setIsProcessing(true);
    
    try {
      const categoryId = getClientPaymentCategory();
      
      if (!categoryId) {
        toast.error("No income category found. Please set up categories first.");
        return false;
      }
      
      const transactionData: Omit<FinanceTransaction, 'id' | 'created_at' | 'updated_at'> = {
        transaction_type: 'income',
        category_id: categoryId,
        amount: paymentAmount,
        transaction_date: paymentDate,
        description: `Payment for Invoice #${invoice.id.slice(0, 8)} - ${invoice.client}`,
        payment_method: paymentMethod,
        source_id: invoice.id,
        source_type: 'invoice'
      };
      
      await addTransaction(transactionData);
      toast.success("Payment recorded and transaction created successfully");
      return true;
    } catch (error) {
      console.error("Error recording payment as transaction:", error);
      toast.error("Failed to create transaction for payment");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    recordPaymentAsTransaction,
    isProcessing
  };
}
