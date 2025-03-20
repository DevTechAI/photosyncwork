
import React from "react";
import { Receipt } from "lucide-react";

export function EmptyTransactionState() {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Receipt className="mx-auto h-12 w-12 mb-4 opacity-20" />
      <h3 className="font-medium">No transactions found</h3>
      <p className="mt-1">Try adjusting your filters or adding a new transaction</p>
    </div>
  );
}
