import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { 
  FinanceCategory, 
  FinanceSubcategory, 
  FinanceTransaction, 
  fetchSubcategories,
  addTransaction,
  updateTransaction 
} from "@/hooks/finances/api/financeApi";

const formSchema = z.object({
  transaction_type: z.enum(["income", "expense"], { required_error: "Transaction type is required" }),
  category_id: z.string().min(1, { message: "Please select a category" }),
  subcategory_id: z.string().optional(),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  transaction_date: z.date({ required_error: "Transaction date is required" }),
  description: z.string().optional(),
  payment_method: z.string().optional(),
});

interface TransactionFormProps {
  onSubmit: (data: Omit<FinanceTransaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: FinanceTransaction;
  categories: FinanceCategory[];
  onCancel: () => void;
}

export function TransactionForm({
  onSubmit,
  initialData,
  categories,
  onCancel,
}: TransactionFormProps) {
  const [subcategories, setSubcategories] = useState<FinanceSubcategory[]>([]);
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>(
    initialData?.transaction_type || 'expense'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  async function handleSubmit(values: z.infer<typeof formSchema>) {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="transaction_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {subcategories.length > 0 && (
          <FormField
            control={form.control}
            name="subcategory_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter amount" 
                  {...field}
                  step="0.01"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="transaction_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Transaction Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal"
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span className="text-muted-foreground">Select a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add details about this transaction (optional)" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update" : "Record"} Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
}
