
import { useToast } from "@/components/ui/use-toast";
import { createScheduledEventFromEstimateEvent } from "@/components/scheduling/utils/eventCreator";
import { saveEvent } from "@/components/scheduling/utils/eventPersistence";
import { ScheduledEvent } from "@/components/scheduling/types";

export function useEventFromEstimate(
  onCreateEvent: (event: ScheduledEvent) => void,
  onClose: () => void
) {
  const { toast } = useToast();
  
  const handleCreateFromEstimate = async (
    selectedEstimateId: string,
    approvedEstimates: any[]
  ) => {
    if (!selectedEstimateId) {
      toast({
        title: "No Estimate Selected",
        description: "Please select an estimate to continue.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const estimate = approvedEstimates.find(est => est.id === selectedEstimateId);
      
      if (!estimate) {
        toast({
          title: "Error",
          description: "Selected estimate not found.",
          variant: "destructive",
        });
        return;
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
      
      if (services.length === 0) {
        toast({
          title: "No Services",
          description: "The selected estimate does not contain any services to create an event from.",
          variant: "destructive",
        });
        return;
      }
      
      // Get the first service to create an event
      const eventData = services[0];
      const newEvent = createScheduledEventFromEstimateEvent(estimate, eventData, selectedPackageIndex);
      
      // Save the event
      await saveEvent(newEvent);
      
      toast({
        title: "Event Created",
        description: "Event has been successfully created from the estimate.",
      });
      
      onCreateEvent(newEvent);
      onClose();
    } catch (error) {
      console.error("Error creating event from estimate:", error);
      toast({
        title: "Error",
        description: "Failed to create event from estimate. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return { handleCreateFromEstimate };
}
