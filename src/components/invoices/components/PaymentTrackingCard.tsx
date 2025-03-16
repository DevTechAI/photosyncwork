
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentTrackingCardProps {
  amount: string;
  onAmountChange: (value: string) => void;
  paidAmount: string;
  onPaidAmountChange: (value: string) => void;
  balanceAmount: string;
  notes: string;
  onNotesChange: (value: string) => void;
}

export function PaymentTrackingCard({
  amount,
  onAmountChange,
  paidAmount,
  onPaidAmountChange,
  balanceAmount,
  notes,
  onNotesChange
}: PaymentTrackingCardProps) {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Payment Tracking</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Amount</Label>
            <Input 
              id="totalAmount" 
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="₹0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paidAmount">Paid Amount</Label>
            <Input 
              id="paidAmount" 
              value={paidAmount}
              onChange={(e) => onPaidAmountChange(e.target.value)}
              placeholder="₹0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="balanceAmount">Balance</Label>
            <Input 
              id="balanceAmount" 
              value={balanceAmount}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Additional notes about payment"
          />
        </div>
      </div>
    </Card>
  );
}
