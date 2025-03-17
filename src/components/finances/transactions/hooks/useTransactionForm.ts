
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  FinanceCategory, 
  FinanceSubcategory, 
  FinanceTransaction, 
  fetchSubcategories,
  addTransaction,
  updateTransaction 
} from "@/hooks/finances/api/financeApi";
import { format } from "date-fns";
import { transactionFormSchema, TransactionFormValues } from "../form/FormSchema";

interface UseTransactionFormProps {
  onSubmit: (data: Omit<FinanceTransaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: FinanceTransaction;
  categories: FinanceCategory[];
  onCancel: () => void;
}

export function useTransactionForm({
  onSubmit,
  initialData,
  categories,
  onCancel,
}: UseTransactionFormProps) {
  const [subcategories, setSubcategories] = useState<FinanceSubcategory[]>([]);
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>(
    initialData?.transaction_type || 'expense'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      transaction_type: initialData?.transaction_type || "expense",
      category_id: initialData?.category_id || "",
      subcategory_id: initialData?.subcategory_id || "",
      amount: initialData ? Number(initialData.amount) : undefined,
      transaction_date: initialData ? new Date(initialData.transaction_date) : new Date(),
      description: initialData?.description || "",
      payment_method: initialData?.payment_method || "",
    },
  });

  const selectedCategoryId = form.watch("category_id");
  const selectedTransactionType = form.watch("transaction_type");

  // Update available categories when transaction type changes
  useEffect(() => {
    if (selectedTransactionType !== selectedType) {
      setSelectedType(selectedTransactionType as 'income' | 'expense');
      form.setValue("category_id", "");
      form.setValue("subcategory_id", "");
    }
  }, [selectedTransactionType, form, selectedType]);

  // Load subcategories when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubcategories(selectedCategoryId)
        .then((data) => {
          setSubcategories(data);
          // Clear subcategory if not found in new list
          const subcategoryId = form.getValues("subcategory_id");
          if (subcategoryId && !data.find(s => s.id === subcategoryId)) {
            form.setValue("subcategory_id", "");
          }
        })
        .catch((error) => {
          console.error("Error loading subcategories:", error);
          toast.error("Failed to load subcategories");
        });
    } else {
      setSubcategories([]);
      form.setValue("subcategory_id", "");
    }
  }, [selectedCategoryId, form]);

  const filteredCategories = categories.filter(
    (cat) => cat.type === selectedTransactionType
  );

  async function handleSubmit(values: TransactionFormValues) {
    try {
      setIsSubmitting(true);
      // Ensure all required fields are present
      const transactionData: Omit<FinanceTransaction, 'id' | 'created_at' | 'updated_at'> = {
        transaction_type: values.transaction_type,
        category_id: values.category_id,
        amount: values.amount,
        transaction_date: format(values.transaction_date, "yyyy-MM-dd"),
        description: values.description || "",
        payment_method: values.payment_method || "",
        subcategory_id: values.subcategory_id || undefined
      };
      
      if (initialData) {
        // Update existing transaction
        await updateTransaction({
          ...transactionData,
          id: initialData.id,
          created_at: initialData.created_at,
          updated_at: initialData.updated_at
        });
      } else {
        // Create new transaction
        await addTransaction(transactionData);
      }
      
      await onSubmit(transactionData);
      toast.success(`Transaction ${initialData ? "updated" : "recorded"} successfully`);
    } catch (error) {
      console.error("Error submitting transaction:", error);
      toast.error(`Failed to ${initialData ? "update" : "record"} transaction`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    subcategories,
    filteredCategories,
    isSubmitting,
    handleSubmit,
    isEditing: !!initialData
  };
}
