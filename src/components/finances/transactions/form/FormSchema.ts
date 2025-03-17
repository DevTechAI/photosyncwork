
import * as z from "zod";

export const transactionFormSchema = z.object({
  transaction_type: z.enum(["income", "expense"], { required_error: "Transaction type is required" }),
  category_id: z.string().min(1, { message: "Please select a category" }),
  subcategory_id: z.string().optional(),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  transaction_date: z.date({ required_error: "Transaction date is required" }),
  description: z.string().optional(),
  payment_method: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
