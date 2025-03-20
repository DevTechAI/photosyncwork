import React from "react";
import { Form } from "@/components/ui/form";
import { useTransactionForm } from "./hooks/useTransactionForm";
import { TransactionTypeField } from "./form/TransactionTypeField";
import { CategoryField } from "./form/CategoryField";
import { SubcategoryField } from "./form/SubcategoryField";
import { AmountField } from "./form/AmountField";
import { DateField } from "./form/DateField";
import { DescriptionField } from "./form/DescriptionField";
import { PaymentMethodField } from "./form/PaymentMethodField";
import { FormActions } from "./form/FormActions";
import { FinanceCategory, FinanceTransaction } from "@/hooks/finances/api/types";

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
  const {
    form,
    subcategories,
    filteredCategories,
    isSubmitting,
    handleSubmit,
    isEditing
  } = useTransactionForm({
    onSubmit,
    initialData,
    categories,
    onCancel
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
      </form>
    </Form>
  );
}
