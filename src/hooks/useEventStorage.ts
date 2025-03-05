
import { ScheduledEvent } from "@/components/scheduling/types";
import { getAllEvents } from "@/components/scheduling/utils/eventHelpers";
import { useToast } from "@/components/ui/use-toast";

export function useEventStorage() {
  const { toast } = useToast();

  // Delete a completed pre-production event reference
  const deleteCompletedEvent = async (eventId: string) => {
    // Get all events from localStorage or Supabase
    const allEvents = await getAllEvents();
    
    // Update the event in localStorage by setting dataCopied to false
    const updatedAllEvents = allEvents.map(event => {
      if (event.id === eventId) {
        return { ...event, dataCopied: false };
      }
      return event;
    });
    
    // Save back to localStorage (this will be updated to use Supabase in a future update)
    localStorage.setItem("scheduledEvents", JSON.stringify(updatedAllEvents));
    
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
