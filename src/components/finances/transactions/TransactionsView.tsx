import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Receipt, Search, Filter, Edit, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchTransactions,
  deleteTransaction,
  FinanceTransaction,
  FinanceCategory,
} from "@/hooks/finances/api/financeApi";
import { toast } from "sonner";
import { format } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TransactionsViewProps {
  categories: FinanceCategory[];
  onAddTransaction: () => void;
}

export function TransactionsView({ categories, onAddTransaction }: TransactionsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinanceTransaction | null>(null);
  const queryClient = useQueryClient();

  // Use React Query to fetch transactions
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', filterType, filterCategory],
    queryFn: async () => {
      const filters: any = {};
      
      if (filterType !== "all") {
        filters.type = filterType as 'income' | 'expense';
      }
      
      if (filterCategory !== "all") {
        filters.categoryId = filterCategory;
      }
      
      return fetchTransactions(filters);
    }
  });

  const handleEdit = (transaction: FinanceTransaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDelete = (transaction: FinanceTransaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTransaction) return;
    
    try {
      await deleteTransaction(selectedTransaction.id);
      toast.success("Transaction deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedTransaction(null);
    }
  };

  const handleSubmitEdit = async () => {
    setIsEditModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    toast.success("Transaction updated successfully");
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (searchTerm === "") return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.description?.toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchLower) ||
      transaction.transaction_date.includes(searchLower) ||
      transaction.payment_method?.toLowerCase().includes(searchLower)
    );
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div className="space-y-4">
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

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select 
              value={filterType} 
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filterCategory} 
              onValueChange={setFilterCategory}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <h3 className="font-medium">No transactions found</h3>
            <p className="mt-1">Try adjusting your filters or adding a new transaction</p>
          </div>
        ) : (
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
                {filteredTransactions.map((transaction) => (
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                              <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleEdit(transaction)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(transaction)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Edit Transaction Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <TransactionForm
              onSubmit={handleSubmitEdit}
              categories={categories}
              onCancel={() => setIsEditModalOpen(false)}
              initialData={selectedTransaction}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this transaction. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

