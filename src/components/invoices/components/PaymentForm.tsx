
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Invoice } from "../types";

interface PaymentFormProps {
  paymentDate: string;
  setPaymentDate: (date: string) => void;
  paymentAmount: string;
  handlePaymentAmountChange: (amount: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  collectedBy: string;
  setCollectedBy: (name: string) => void;
  amountError: string;
  maxAllowedPayment: number;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export function PaymentForm({
  paymentDate,
  setPaymentDate,
  paymentAmount,
  handlePaymentAmountChange,
  paymentMethod,
  setPaymentMethod,
  collectedBy,
  setCollectedBy,
  amountError,
  maxAllowedPayment,
  handleSubmit,
  onClose
}: PaymentFormProps) {
  return (
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
        <Label htmlFor="paymentAmount">
          Payment Amount (Max: ₹{maxAllowedPayment.toLocaleString()})
        </Label>
        <Input 
          id="paymentAmount" 
          type="text" 
          value={paymentAmount}
          onChange={(e) => handlePaymentAmountChange(e.target.value)}
          placeholder="₹0.00"
          className={amountError ? "border-red-500" : ""}
        />
        {amountError && (
          <p className="text-red-500 text-sm mt-1">{amountError}</p>
        )}
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
        <Button type="submit" disabled={!!amountError}>
          Record Payment
        </Button>
      </div>
    </form>
  );
}
