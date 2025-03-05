
import { ScheduledEvent } from "@/components/scheduling/types";
import { getAllEvents, saveEvent } from "@/components/scheduling/utils/eventHelpers";
import { useToast } from "@/components/ui/use-toast";

export function useEventStorage() {
  const { toast } = useToast();

  // Delete a completed pre-production event reference
  const deleteCompletedEvent = async (eventId: string) => {
    // Get all events from Supabase
    const allEvents = await getAllEvents();
    
    // Update the event by setting dataCopied to false
    const updatedAllEvents = allEvents.map(event => {
      if (event.id === eventId) {
        return { ...event, dataCopied: false };
      }
      return event;
    });
    
    // Save the updated event back to Supabase
    const eventToUpdate = updatedAllEvents.find(event => event.id === eventId);
    if (eventToUpdate) {
      await saveEvent(eventToUpdate);
    }
    
    // Show toast notification
    toast({
      title: "Event Deleted",
      description: "The event reference has been deleted"
    });

    return updatedAllEvents.filter(event => 
      event.stage === "production" && 
      event.dataCopied === true
    );
  };

  return {
    deleteCompletedEvent
  };
}
