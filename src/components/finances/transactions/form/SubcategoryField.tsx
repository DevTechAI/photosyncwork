
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "./FormSchema";
import { FinanceSubcategory } from "@/hooks/finances/api/financeApi";

interface SubcategoryFieldProps {
  form: UseFormReturn<TransactionFormValues>;
  subcategories: FinanceSubcategory[];
}

export function SubcategoryField({ form, subcategories }: SubcategoryFieldProps) {
  if (subcategories.length === 0) {
    return null;
  }
  
  return (
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
  );
}
