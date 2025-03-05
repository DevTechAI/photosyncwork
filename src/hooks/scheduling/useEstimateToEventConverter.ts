
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getApprovedEstimates } from "@/components/scheduling/utils/approvedEstimatesLoader";
import { createScheduledEventFromEstimateEvent } from "@/components/scheduling/utils/eventCreator";
import { ScheduledEvent } from "@/components/scheduling/types";

export function useEstimateToEventConverter() {
  const { toast } = useToast();
  const [isConverting, setIsConverting] = useState(false);
  
  /**
   * Converts an estimate to a scheduled event
   */
  const convertEstimateToEvent = async (estimateId: string): Promise<ScheduledEvent | null> => {
    if (!estimateId) {
      toast({
        title: "Error",
        description: "No estimate ID provided",
        variant: "destructive",
      });
      return null;
    }
    
    setIsConverting(true);
    
    try {
      // Fetch approved estimates
      const approvedEstimates = await getApprovedEstimates();
      
      // Find the specific estimate
      const estimate = approvedEstimates.find(est => est.id === estimateId);
      
      if (!estimate) {
        toast({
          title: "Error",
          description: "Estimate not found",
          variant: "destructive",
        });
        return null;
      }
      
      // Determine which package was selected
      const selectedPackageIndex = estimate.selectedPackageIndex || 0;
      
      // Get the services from the selected package
      let services = [];
      if (estimate.packages && estimate.packages.length > selectedPackageIndex) {
        services = estimate.packages[selectedPackageIndex].services || [];
      } else {
        services = estimate.services || [];
      }
      
      // Get the first service to create an event
      if (services.length === 0) {
        toast({
          title: "Error",
          description: "No services found in the estimate",
          variant: "destructive",
        });
        return null;
      }
      
      // Create event from the first service
      const event = createScheduledEventFromEstimateEvent(estimate, services[0], selectedPackageIndex);
      
      toast({
        title: "Success",
        description: "Event created from estimate",
      });
      
      return event;
    } catch (error) {
      console.error("Error converting estimate to event:", error);
      toast({
        title: "Error",
        description: "Failed to convert estimate to event",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsConverting(false);
    }
  };
  
  return {
    convertEstimateToEvent,
    isConverting
  };
}
