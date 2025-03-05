
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createEventsFromApprovedEstimates } from "@/components/scheduling/utils/estimateConversion";
import { supabase } from "@/integrations/supabase/client";

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
      console.log("StatusChecker active, setting up interval to check for estimate status changes");
      
      intervalId = setInterval(async () => {
        try {
          // Check localStorage for estimate status updates (legacy support)
          const savedEstimates = localStorage.getItem("estimates");
          if (savedEstimates) {
            console.log("Checking saved estimates for status changes...");
            
            const estimates = JSON.parse(savedEstimates);
            const updatedEstimate = estimates.find((est: any) => est.id === estimate.id);
            
            if (updatedEstimate) {
              console.log("Found estimate in localStorage:", updatedEstimate);
              
              if (updatedEstimate.status === 'approved') {
                console.log("Estimate was approved, triggering status change");
                onStatusChange(estimate.id, 'approved');
                
                // Create events from approved estimates and save to Supabase
                console.log("Creating events from approved estimate...");
                const newEvents = await createEventsFromApprovedEstimates();
                
                if (newEvents.length > 0) {
                  console.log("New events created successfully:", newEvents);
                  toast({
                    title: "Event Created",
                    description: "This estimate has been converted to an event in pre-production.",
                  });
                } else {
                  console.log("No new events were created from the approved estimate");
                  toast({
                    title: "Event Conversion Issue",
                    description: "Could not create event from estimate. Please check the console for details.",
                    variant: "destructive",
                  });
                }
                
                toast({
                  title: "Estimate Approved!",
                  description: "The client has approved the estimate.",
                });
                clearInterval(intervalId);
              }
            }
          }
        } catch (error) {
          console.error("Error checking estimate status:", error);
          toast({
            title: "Error",
            description: "Failed to check estimate status or create event.",
            variant: "destructive",
          });
        }
      }, 5000); // Check every 5 seconds
    }
    
    return () => {
      if (intervalId) {
        console.log("Clearing StatusChecker interval");
        clearInterval(intervalId);
      }
    };
  }, [isActive, estimate?.id, estimate?.status, onStatusChange, toast]);

  // This is a utility component with no UI
  return null;
}
