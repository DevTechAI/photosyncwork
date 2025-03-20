
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Invoice } from "../types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTransactionsBySource } from "@/hooks/finances/api/transactionApi";
import { FinanceTransaction } from "@/hooks/finances/api/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";

interface LinkedTransactionsProps {
  invoice: Invoice;
  onCreateTransaction?: () => void;
}

export function LinkedTransactions({ invoice, onCreateTransaction }: LinkedTransactionsProps) {
  const queryClient = useQueryClient();
  
  // Fetch transactions linked to this invoice
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', 'invoice', invoice.id],
    queryFn: () => fetchTransactionsBySource(invoice.id, 'invoice'),
  });
  
  // Calculate total payments recorded in transactions
  const totalPaymentsRecorded = transactions.reduce((sum, t) => 
    t.transaction_type === 'income' ? sum + Number(t.amount) : sum, 0
  );
  
  // Parse invoice paid amount
  const invoicePaidAmount = parseFloat(invoice.paidAmount.replace(/[₹,]/g, "")) || 0;
  
  // Check if there's a discrepancy between invoice payments and transactions
  const hasDiscrepancy = Math.abs(totalPaymentsRecorded - invoicePaidAmount) > 0.01;
  
  // Refresh transactions when invoice changes
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['transactions', 'invoice', invoice.id] });
  }, [invoice, queryClient]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Payment Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Payment Transactions</span>
          {onCreateTransaction && (
            <Button variant="outline" size="sm" onClick={onCreateTransaction}>
              <Plus className="h-4 w-4 mr-1" /> Record Transaction
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No transactions linked to this invoice.</p>
            {hasDiscrepancy && (
              <div className="mt-2">
                <Badge variant="destructive">Discrepancy Detected</Badge>
                <p className="text-sm mt-1">
                  Invoice shows ₹{invoicePaidAmount.toLocaleString('en-IN')} paid but no transactions are recorded.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {hasDiscrepancy && (
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <Badge variant="warning">Payment Mismatch</Badge>
                <p className="text-sm mt-1">
                  Invoice shows ₹{invoicePaidAmount.toLocaleString('en-IN')} paid but transactions total 
                  ₹{totalPaymentsRecorded.toLocaleString('en-IN')}.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{format(new Date(transaction.transaction_date), "dd MMM yyyy")}</p>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.payment_method ? transaction.payment_method.replace('_', ' ') : 'No payment method'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">₹{Number(transaction.amount).toLocaleString('en-IN')}</p>
                    <Link to={`/finances?transaction=${transaction.id}`} className="text-xs text-blue-600 flex items-center">
                      View <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
