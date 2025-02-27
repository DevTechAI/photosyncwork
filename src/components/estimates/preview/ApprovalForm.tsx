
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApprovalFormProps {
  onClose: () => void;
  estimate: {
    id: string;
    amount: string;
    status: string;
  };
  onStatusChange: (estimateId: string, newStatus: string, negotiatedAmount?: string) => void;
}

export function ApprovalForm({ onClose, estimate, onStatusChange }: ApprovalFormProps) {
  const [negotiatedAmount, setNegotiatedAmount] = useState(estimate.amount || "");
  
  const handleStatusChange = (newStatus: string) => {
    onStatusChange(estimate.id, newStatus, negotiatedAmount);
    onClose();
  };

  const handleApproval = () => {
    handleStatusChange("approved");
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="status">Update Estimate Status</Label>
            <Select
              onValueChange={(value) => handleStatusChange(value)}
              defaultValue={estimate.status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="negotiating">Negotiating</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="negotiatedAmount">Negotiated Amount</Label>
            <div className="flex items-end gap-2">
              <Input
                id="negotiatedAmount"
                placeholder="₹0.00"
                value={negotiatedAmount}
                onChange={(e) => setNegotiatedAmount(e.target.value)}
              />
              <Button onClick={handleApproval} variant="default" className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
