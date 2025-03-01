
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createEventsFromApprovedEstimates } from "@/components/scheduling/utils/eventHelpers";
import { useToast } from "@/components/ui/use-toast";

interface ApprovalFormProps {
  onClose: () => void;
  estimate: {
    id: string;
    amount: string;
    packages?: Array<{
      name?: string;
      amount: string;
      services: any[];
    }>;
  };
  onStatusChange: (estimateId: string, newStatus: string, negotiatedAmount?: string, selectedPackageIndex?: number) => void;
}

export function ApprovalForm({ onClose, estimate, onStatusChange }: ApprovalFormProps) {
  const [isNegotiated, setIsNegotiated] = useState(false);
  const [negotiatedAmount, setNegotiatedAmount] = useState(estimate.amount);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState<number | undefined>(
    estimate.packages && estimate.packages.length > 0 ? 0 : undefined
  );
  const { toast } = useToast();

  const handleApprove = () => {
    // Fix any circular references in deliverables before storing the estimate
    const savedEstimates = localStorage.getItem("estimates");
    if (savedEstimates) {
      const estimates = JSON.parse(savedEstimates);
      const currentEstimateIndex = estimates.findIndex(est => est.id === estimate.id);
      
      if (currentEstimateIndex !== -1) {
        // Make sure packages have proper deliverables (not circular references)
        if (estimates[currentEstimateIndex].packages) {
          estimates[currentEstimateIndex].packages = estimates[currentEstimateIndex].packages.map(pkg => {
            // If deliverables is a circular reference or invalid, use the main deliverables
            if (!Array.isArray(pkg.deliverables)) {
              return {
                ...pkg,
                deliverables: estimates[currentEstimateIndex].deliverables
              };
            }
            return pkg;
          });
          
          // Update the storage
          localStorage.setItem("estimates", JSON.stringify(estimates));
        }
      }
    }
    
    // Update the status
    onStatusChange(
      estimate.id, 
      'approved', 
      isNegotiated ? negotiatedAmount : undefined,
      selectedPackageIndex
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

  // Only show package selection if there are multiple packages
  const showPackageSelector = estimate.packages && estimate.packages.length > 1;

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
          {showPackageSelector && (
            <div className="space-y-3">
              <Label>Select approved package option</Label>
              <RadioGroup 
                value={selectedPackageIndex?.toString()} 
                onValueChange={(value) => setSelectedPackageIndex(parseInt(value))}
              >
                {estimate.packages?.map((pkg, index) => (
                  <div key={index} className="flex items-center space-x-2 py-2 border rounded-md px-3">
                    <RadioGroupItem value={index.toString()} id={`package-${index}`} />
                    <Label htmlFor={`package-${index}`} className="flex-1 cursor-pointer">
                      <div className="flex justify-between w-full">
                        <span>Package Option {index + 1}</span>
                        <span className="font-semibold">{pkg.amount}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

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
          <Button 
            onClick={handleApprove}
            disabled={showPackageSelector && selectedPackageIndex === undefined}
          >
            Approve Estimate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
