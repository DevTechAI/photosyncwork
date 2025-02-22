
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Percent } from "lucide-react";
import { calculateGST, calculateSubtotal, calculateTotal } from "../utils/calculations";

interface TotalCardProps {
  items: { amount: string }[];
  gstRate: string;
  onGstRateChange: (rate: string) => void;
}

export function TotalCard({ items, gstRate, onGstRateChange }: TotalCardProps) {
  const subtotal = calculateSubtotal(items);
  const gst = calculateGST(subtotal, gstRate);
  const total = calculateTotal(subtotal, gst);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="gst">GST Rate</Label>
            <div className="relative mt-2">
              <Input
                id="gst"
                type="number"
                value={gstRate}
                onChange={(e) => onGstRateChange(e.target.value)}
                className="pr-10"
              />
              <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST ({gstRate}%):</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
