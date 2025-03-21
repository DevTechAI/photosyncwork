
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Send, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card } from "../ui/card";
import { Invoice } from "./types";
import { format } from "date-fns";

interface InvoiceDetailsProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export function InvoiceDetails({ invoice, open, onClose, onEdit }: InvoiceDetailsProps) {
  if (!invoice) return null;

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

  // Format date helper function
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Invoice {invoice.displayNumber || `#${invoice.id.substring(0, 8)}`}</span>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit} className="gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Client & Invoice Info */}
            <Card className="p-4 space-y-4">
              <div>
                <h3 className="font-medium">Client Details</h3>
                <div className="mt-2 space-y-1">
                  <p className="font-medium">{invoice.client}</p>
                  {invoice.clientEmail && <p className="text-sm text-muted-foreground">{invoice.clientEmail}</p>}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium">Invoice Details</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Invoice Number:</span>
                    <span>{invoice.displayNumber || `#${invoice.id.substring(0, 8)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <span>{formatDate(invoice.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className={getStatusStyle(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Payment Summary */}
            <Card className="p-4 space-y-4">
              <div>
                <h3 className="font-medium">Payment Summary</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Amount:</span>
                    <span className="font-medium">₹{invoice.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Paid Amount:</span>
                    <span className="text-green-600">₹{invoice.paidAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Balance Due:</span>
                    <span className="text-red-600">₹{invoice.balanceAmount}</span>
                  </div>
                </div>
              </div>
              
              {invoice.paymentMethod && (
                <div>
                  <h3 className="font-medium">Payment Details</h3>
                  <div className="mt-2 space-y-1">
                    {invoice.paymentDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Payment Date:</span>
                        <span>{formatDate(invoice.paymentDate)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Payment Method:</span>
                      <span className="capitalize">{invoice.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
          
          {/* Invoice Items */}
          <div>
            <h3 className="font-medium mb-2">Invoice Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70%]">Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">₹{item.amount}</TableCell>
                  </TableRow>
                ))}
                
                {/* GST row if applicable */}
                {invoice.gstRate && parseInt(invoice.gstRate) > 0 && (
                  <TableRow>
                    <TableCell>GST ({invoice.gstRate}%)</TableCell>
                    <TableCell className="text-right">
                      ₹{(parseFloat(invoice.amount) - invoice.items.reduce((sum, item) => 
                        sum + (parseFloat(item.amount.replace(/[₹,]/g, "")) || 0), 0)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                
                {/* Total row */}
                <TableRow>
                  <TableCell className="font-medium">Total</TableCell>
                  <TableCell className="text-right font-medium">₹{invoice.amount}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          {/* Payment History */}
          {invoice.payments && invoice.payments.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Payment History</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Collected By</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell className="capitalize">{payment.method}</TableCell>
                      <TableCell>{payment.collected_by}</TableCell>
                      <TableCell className="text-right text-green-600">₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Notes */}
          {invoice.notes && (
            <div>
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Send to Client
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
