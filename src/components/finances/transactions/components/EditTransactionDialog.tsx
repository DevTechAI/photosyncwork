
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from "../TransactionForm";
import { FinanceTransaction, FinanceCategory } from "@/hooks/finances/api/types";

interface EditTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: FinanceTransaction | null;
  categories: FinanceCategory[];
  onSubmit: (data: Omit<FinanceTransaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export function EditTransactionDialog({
  open,
  onOpenChange,
  transaction,
  categories,
  onSubmit,
}: EditTransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        {transaction && (
          <TransactionForm
            onSubmit={onSubmit}
            categories={categories}
            onCancel={() => onOpenChange(false)}
            initialData={transaction}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
