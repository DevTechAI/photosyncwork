
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TransactionHeaderProps {
  onAddTransaction: () => void;
}

export function TransactionHeader({ onAddTransaction }: TransactionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground mt-1">
          Manage your income and expense transactions
        </p>
      </div>
      <div>
        <Button onClick={onAddTransaction} className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Transaction
        </Button>
      </div>
    </div>
  );
}
