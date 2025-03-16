
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Receipt, ArrowUpDown, Wallet } from "lucide-react";
import { useState } from "react";
import { Invoice } from "../types";
import { RecordPaymentDialog } from "./RecordPaymentDialog";

interface InvoicesListProps {
  invoices: Invoice[];
  sortBy: "date" | "amount";
  setSortBy: (sortBy: "date" | "amount") => void;
  onViewDetails: (invoice: Invoice) => void;
  onRecordPayment?: (invoice: Invoice) => void;
}

export function InvoicesList({
  invoices,
  sortBy,
  setSortBy,
  onViewDetails,
  onRecordPayment,
}: InvoicesListProps) {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Format payment status with appropriate styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const handleRecordPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  };

  const handleSavePayment = (updatedInvoice: Invoice) => {
    if (onRecordPayment) {
      onRecordPayment(updatedInvoice);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Invoices</h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => setSortBy(sortBy === "date" ? "amount" : "date")}
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort by {sortBy === "date" ? "Amount" : "Date"}
          </Button>
        </div>
        
        {invoices.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No invoices found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoices.map((invoice: Invoice) => (
              <Card key={invoice.id} className="hover:bg-card-hover transition-colors duration-200 cursor-pointer">
                <div className="p-4" onClick={() => onViewDetails(invoice)}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.client}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.id} · {invoice.date}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <span className="font-medium">{invoice.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className={getStatusStyle(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(invoice);
                      }}
                    >
                      View Details
                    </Button>
                    
                    {onRecordPayment && invoice.status !== "paid" && (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="text-xs h-8 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRecordPayment(invoice);
                        }}
                      >
                        <Wallet className="h-3 w-3" />
                        Record Payment
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      {selectedInvoice && (
        <RecordPaymentDialog
          open={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          onSave={handleSavePayment}
          invoice={selectedInvoice}
        />
      )}
    </Card>
  );
}
