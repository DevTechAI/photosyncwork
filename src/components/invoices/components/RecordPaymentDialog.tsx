
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Invoice } from "../types";

interface RecordPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
  invoice: Invoice;
}

export function RecordPaymentDialog({ 
  open, 
  onClose, 
  onSave, 
  invoice 
}: RecordPaymentDialogProps) {
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentAmount, setPaymentAmount] = useState<string>(invoice.balanceAmount || "");
  const [paymentMethod, setPaymentMethod] = useState<string>("bank");
  const [collectedBy, setCollectedBy] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validation
    if (!paymentDate) {
      toast.error("Please select a payment date");
      return;
    }
    
    if (!paymentAmount) {
      toast.error("Please enter a payment amount");
      return;
    }
    
    // Convert amounts to numbers for calculation
    const currentPaid = parseFloat(invoice.paidAmount.replace(/[₹,]/g, "")) || 0;
    const newPayment = parseFloat(paymentAmount.replace(/[₹,]/g, "")) || 0;
    const totalAmount = parseFloat(invoice.amount.replace(/[₹,]/g, "")) || 0;
    
    // Calculate new paid amount and balance
    const updatedPaidAmount = (currentPaid + newPayment).toString();
    const updatedBalanceAmount = Math.max(0, totalAmount - (currentPaid + newPayment)).toString();
    
    // Determine status based on payment
    const updatedStatus = 
      currentPaid + newPayment >= totalAmount 
        ? "paid" 
        : currentPaid + newPayment > 0 
          ? "partial" 
          : "pending";
    
    // Create updated invoice object
    const updatedInvoice: Invoice = {
      ...invoice,
      paidAmount: updatedPaidAmount,
      balanceAmount: updatedBalanceAmount,
      status: updatedStatus,
      paymentDate: paymentDate,
      paymentMethod: paymentMethod,
      notes: invoice.notes 
        ? `${invoice.notes}\n${new Date().toLocaleDateString()}: Payment of ${paymentAmount} collected by ${collectedBy || 'staff'}`
        : `${new Date().toLocaleDateString()}: Payment of ${paymentAmount} collected by ${collectedBy || 'staff'}`
    };
    
    onSave(updatedInvoice);
    onClose();
    
    toast.success("Payment recorded successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a payment for invoice #{invoice.id} for {invoice.client}
          </DialogDescription>
        </DialogHeader>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="paymentDate">Payment Date</Label>
            <Input 
              id="paymentDate" 
              type="date" 
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentAmount">Payment Amount</Label>
            <Input 
              id="paymentAmount" 
              type="text" 
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="₹0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="collectedBy">Collected By</Label>
            <Input 
              id="collectedBy" 
              type="text" 
              value={collectedBy}
              onChange={(e) => setCollectedBy(e.target.value)}
              placeholder="Staff name"
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Record Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
