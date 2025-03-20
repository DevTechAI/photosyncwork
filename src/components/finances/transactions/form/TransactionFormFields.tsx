
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "./FormSchema";
import { FinanceCategory, FinanceSubcategory } from "@/hooks/finances/api/types";
import { TransactionTypeField } from "./TransactionTypeField";
import { CategoryField } from "./CategoryField";
import { SubcategoryField } from "./SubcategoryField";
import { AmountField } from "./AmountField";
import { DateField } from "./DateField";
import { DescriptionField } from "./DescriptionField";
import { PaymentMethodField } from "./PaymentMethodField";
import { FormActions } from "./FormActions";

interface TransactionFormFieldsProps {
  form: UseFormReturn<TransactionFormValues>;
  subcategories: FinanceSubcategory[];
  filteredCategories: FinanceCategory[];
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

export function TransactionFormFields({
  form,
  subcategories,
  filteredCategories,
  isSubmitting,
  isEditing,
  onCancel,
}: TransactionFormFieldsProps) {
  return (
    <>
      <TransactionTypeField form={form} />
      <CategoryField form={form} filteredCategories={filteredCategories} />
      <SubcategoryField form={form} subcategories={subcategories} />
      <AmountField form={form} />
      <DateField form={form} />
      <DescriptionField form={form} />
      <PaymentMethodField form={form} />
      <FormActions 
        onCancel={onCancel} 
        isSubmitting={isSubmitting} 
        isEditing={isEditing} 
      />
    </>
  );
}
