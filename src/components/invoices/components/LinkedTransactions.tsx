
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FinanceTransaction } from "@/hooks/finances/api/types";
import { fetchTransactionsBySource } from "@/hooks/finances/api/transactionApi";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

interface LinkedTransactionsProps {
  invoiceId: string;
  onAddTransaction?: () => void;
  onEditTransaction?: (transaction: FinanceTransaction) => void;
  onDeleteTransaction?: (transactionId: string) => void;
}

export function LinkedTransactions({
  invoiceId,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction
}: LinkedTransactionsProps) {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['invoiceTransactions', invoiceId],
    queryFn: () => fetchTransactionsBySource(invoiceId, 'invoice'),
    enabled: !!invoiceId
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Loading Transactions
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Linked Transactions</CardTitle>
          <CardDescription>
            No transactions are linked to this invoice yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {onAddTransaction && (
            <Button onClick={onAddTransaction} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Transaction
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Linked Transactions</CardTitle>
        <CardDescription>
          Transactions linked to this invoice
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{formatDate(new Date(transaction.transaction_date), 'PP')}</p>
                  <Badge variant={transaction.transaction_type === 'income' ? 'secondary' : 'outline'}>
                    {transaction.transaction_type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{transaction.description || 'No description'}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-medium">{formatAmount(transaction.amount)}</p>
                <div className="flex gap-1">
                  {onEditTransaction && (
                    <Button variant="ghost" size="icon" onClick={() => onEditTransaction(transaction)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDeleteTransaction && (
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDeleteTransaction(transaction.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {onAddTransaction && (
            <Button onClick={onAddTransaction} className="w-full mt-4">
              <Plus className="h-4 w-4 mr-2" /> Add Transaction
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
