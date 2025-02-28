
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEventsFromApprovedEstimates } from "@/components/scheduling/utils/eventHelpers";
import { useToast } from "@/components/ui/use-toast";

interface ApprovalFormProps {
  onClose: () => void;
  estimate: {
    id: string;
    amount: string;
  };
  onStatusChange: (estimateId: string, newStatus: string, negotiatedAmount?: string) => void;
}

export function ApprovalForm({ onClose, estimate, onStatusChange }: ApprovalFormProps) {
  const [isNegotiated, setIsNegotiated] = useState(false);
  const [negotiatedAmount, setNegotiatedAmount] = useState(estimate.amount);
  const { toast } = useToast();

  const handleApprove = () => {
    onStatusChange(
      estimate.id, 
      'approved', 
      isNegotiated ? negotiatedAmount : undefined
    );
    
    // Create events from approved estimates
    setTimeout(() => {
      const newEvents = createEventsFromApprovedEstimates();
      
      if (newEvents.length > 0) {
        toast({
          title: "Event Created",
          description: "This estimate has been converted to an event in pre-production.",
        });
      }
    }, 500); // Short delay to ensure estimate status is saved first
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Approve Estimate</DialogTitle>
          <DialogDescription>
            Mark this estimate as approved by the client.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-2">
            <div className="flex h-5 items-center">
              <input
                id="negotiated"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={isNegotiated}
                onChange={(e) => setIsNegotiated(e.target.checked)}
              />
            </div>
            <div className="ml-2 text-sm">
              <Label htmlFor="negotiated">Client negotiated a different amount</Label>
            </div>
          </div>
          
          {isNegotiated && (
            <div className="space-y-2">
              <Label htmlFor="amount">Negotiated Amount</Label>
              <Input
                id="amount"
                type="text"
                value={negotiatedAmount}
                onChange={(e) => setNegotiatedAmount(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleApprove}>Approve Estimate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
