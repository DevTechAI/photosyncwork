
import React from "react";
import { Form } from "@/components/ui/form";
import { useTransactionForm } from "./hooks/useTransactionForm";
import { TransactionFormFields } from "./form/TransactionFormFields";
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
        <TransactionFormFields
          form={form}
          subcategories={subcategories}
          filteredCategories={filteredCategories}
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
}
