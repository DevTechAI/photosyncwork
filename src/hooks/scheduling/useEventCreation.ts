
import { useState } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { scheduledEventToDb } from "@/utils/supabaseConverters";

export function useEventCreation() {
  const { toast } = useToast();
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  
  const handleCreateEvent = async (newEvent: ScheduledEvent) => {
    try {
      // Convert to database format
      const dbEvent = scheduledEventToDb(newEvent);
      
      // Insert into Supabase
      const { error } = await supabase
        .from('scheduled_events')
        .insert(dbEvent);
      
      if (error) {
        console.error("Error creating event in Supabase:", error);
        toast({
          title: "Error",
          description: "Failed to save event. Please try again.",
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Event Created",
        description: `${newEvent.name} has been scheduled successfully.`
      });
      
      return true;
    } catch (error) {
      console.error("Error in handleCreateEvent:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    showCreateEventModal,
    setShowCreateEventModal,
    handleCreateEvent
  };
}
