
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "./FormSchema";

interface AmountFieldProps {
  form: UseFormReturn<TransactionFormValues>;
}

export function AmountField({ form }: AmountFieldProps) {
  return (
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
  );
}
