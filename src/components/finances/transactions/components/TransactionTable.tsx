
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FinanceTransaction, FinanceCategory } from "@/hooks/finances/api/financeApi";
import { format } from "date-fns";
import { TransactionActions } from "./TransactionActions";

interface TransactionTableProps {
  transactions: FinanceTransaction[];
  categories: FinanceCategory[];
  onEdit: (transaction: FinanceTransaction) => void;
  onDelete: (transaction: FinanceTransaction) => void;
}

export function TransactionTable({ 
  transactions, 
  categories,
  onEdit,
  onDelete 
}: TransactionTableProps) {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {format(new Date(transaction.transaction_date), "dd MMM yyyy")}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    transaction.transaction_type === "income"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {transaction.transaction_type === "income" ? "Income" : "Expense"}
                </span>
              </TableCell>
              <TableCell>{getCategoryName(transaction.category_id)}</TableCell>
              <TableCell>{transaction.description || "-"}</TableCell>
              <TableCell>
                {transaction.payment_method
                  ? transaction.payment_method.replace("_", " ")
                  : "-"}
              </TableCell>
              <TableCell className="text-right font-medium">
                <span
                  className={
                    transaction.transaction_type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {transaction.transaction_type === "income" ? "+" : "-"} ₹
                  {Number(transaction.amount).toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                <TransactionActions 
                  transaction={transaction}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
