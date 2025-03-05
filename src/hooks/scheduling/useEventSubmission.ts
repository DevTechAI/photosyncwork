
import { useToast } from "@/components/ui/use-toast";
import { EventFormValues } from "./useCreateEventModal";
import { checkEventExistsForEstimateEvent } from "@/components/scheduling/utils/eventExistenceChecker";
import { saveEvent } from "@/components/scheduling/utils/eventPersistence";
import { ScheduledEvent } from "@/components/scheduling/types";

export function useEventSubmission(
  onCreateEvent: (event: ScheduledEvent) => void,
  onClose: () => void
) {
  const { toast } = useToast();
  
  const handleSubmitForm = async (
    data: EventFormValues, 
    selectedEstimateId: string
  ) => {
    try {
      // Check if this event already exists
      const eventExists = await checkEventExistsForEstimateEvent(
        selectedEstimateId, 
        data.name
      );
      
      if (eventExists) {
        toast({
          title: "Event Already Exists",
          description: "An event with the same name already exists for this estimate.",
          variant: "destructive",
        });
        return;
      }
      
      // Create new event
      const newEvent: ScheduledEvent = {
        id: crypto.randomUUID(),
        estimateId: selectedEstimateId,
        name: data.name,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        clientName: data.clientName,
        clientPhone: data.clientPhone || "",
        clientEmail: data.clientEmail,
        guestCount: data.guestCount.toString(),
        photographersCount: data.photographersCount,
        videographersCount: data.videographersCount,
        assignments: [],
        notes: "",
        stage: "pre-production",
        clientRequirements: data.clientRequirements || "",
        references: data.references || [],
        timeTracking: [],
      };
      
      // Save the event
      await saveEvent(newEvent);
      
      toast({
        title: "Event Created",
        description: "Event has been successfully created and scheduled.",
      });
      
      // Call the provided onCreateEvent callback
      onCreateEvent(newEvent);
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return { handleSubmitForm };
}
