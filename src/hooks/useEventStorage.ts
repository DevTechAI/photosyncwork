
import { ScheduledEvent } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { dbToScheduledEvent, scheduledEventToDb } from "@/utils/supabaseConverters";

export function useEventStorage() {
  const { toast } = useToast();

  // Delete a completed pre-production event reference
  const deleteCompletedEvent = async (eventId: string) => {
    try {
      // Get the event from Supabase
      const { data: eventData, error: fetchError } = await supabase
        .from('scheduled_events')
        .select('*')
        .eq('id', eventId)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching event:', fetchError);
        toast({
          title: "Error",
          description: "Could not find the event",
          variant: "destructive"
        });
        return [];
      }
      
      if (!eventData) {
        toast({
          title: "Error",
          description: "Event not found",
          variant: "destructive"
        });
        return [];
      }
      
      // Convert to frontend model
      const event = dbToScheduledEvent(eventData);
      
      // Update the event by setting dataCopied to false
      const updatedEvent = { ...event, dataCopied: false };
      
      // Convert back to DB format
      const dbEvent = scheduledEventToDb(updatedEvent);
      
      // Save the updated event back to Supabase
      const { error: updateError } = await supabase
        .from('scheduled_events')
        .update(dbEvent)
        .eq('id', eventId);
      
      if (updateError) {
        console.error('Error updating event:', updateError);
        toast({
          title: "Error",
          description: "Failed to update the event",
          variant: "destructive"
        });
        return [];
      }
      
      // Show toast notification
      toast({
        title: "Event Deleted",
        description: "The event reference has been deleted"
      });
      
      // Get all completed events
      const { data: allEventsData, error: allEventsError } = await supabase
        .from('scheduled_events')
        .select('*')
        .eq('stage', 'production')
        .eq('datacopied', true);
      
      if (allEventsError) {
        console.error('Error fetching completed events:', allEventsError);
        return [];
      }
      
      // Convert to frontend models
      return (allEventsData || []).map(record => dbToScheduledEvent(record));
    } catch (error) {
      console.error('Error in deleteCompletedEvent:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  };

  return {
    deleteCompletedEvent
  };
}
