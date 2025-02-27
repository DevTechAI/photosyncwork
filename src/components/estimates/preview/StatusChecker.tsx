
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface StatusCheckerProps {
  isActive: boolean;
  estimate: {
    id: string;
    status: string;
  };
  onStatusChange: (estimateId: string, newStatus: string) => void;
}

export function StatusChecker({ isActive, estimate, onStatusChange }: StatusCheckerProps) {
  const { toast } = useToast();

  useEffect(() => {
    let intervalId: ReturnType<typeof setTimeout>;
    
    if (isActive && estimate?.status === 'pending') {
      intervalId = setInterval(() => {
        // Check localStorage for estimate status updates
        const savedEstimates = localStorage.getItem("estimates");
        if (savedEstimates) {
          const estimates = JSON.parse(savedEstimates);
          const updatedEstimate = estimates.find((est: any) => est.id === estimate.id);
          
          if (updatedEstimate && updatedEstimate.status === 'approved') {
            onStatusChange(estimate.id, 'approved');
            toast({
              title: "Estimate Approved!",
              description: "The client has approved the estimate.",
            });
            clearInterval(intervalId);
          }
        }
      }, 5000); // Check every 5 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, estimate?.id, estimate?.status, onStatusChange, toast]);

  // This is a utility component with no UI
  return null;
}
