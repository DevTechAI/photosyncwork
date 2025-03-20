
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "./FormSchema";

interface PaymentMethodFieldProps {
  form: UseFormReturn<TransactionFormValues>;
}

export function PaymentMethodField({ form }: PaymentMethodFieldProps) {
  return (
    <FormField
      control={form.control}
      name="payment_method"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Payment Method</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value || "none"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method (optional)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
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
  );
}
