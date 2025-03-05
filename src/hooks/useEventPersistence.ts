
import { useEffect } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";
import { scheduledEventToDb } from "@/utils/supabaseConverters";
import { useToast } from "@/components/ui/use-toast";

export function useEventPersistence(events: ScheduledEvent[]) {
  const { toast } = useToast();

  // Save events to Supabase whenever they change
  useEffect(() => {
    if (events.length > 0) {
      // Save all pre-production events to Supabase
      const saveToSupabase = async () => {
        try {
          // Update each event in Supabase
          for (const event of events) {
            // Convert to database format
            const dbEvent = scheduledEventToDb(event);
            
            // Check if event exists
            const { data: existingEvent } = await supabase
              .from('scheduled_events')
              .select('id')
              .eq('id', event.id)
              .maybeSingle();
            
            if (existingEvent) {
              // Update existing event
              await supabase
                .from('scheduled_events')
                .update(dbEvent)
                .eq('id', event.id);
            } else {
              // Insert new event
              await supabase
                .from('scheduled_events')
                .insert(dbEvent);
            }
          }
        } catch (error) {
          console.error("Error saving events to Supabase:", error);
          toast({
            title: "Error",
            description: "Failed to save event data to the database",
            variant: "destructive"
          });
        }
      };
      
      saveToSupabase();
    }
  }, [events, toast]);
}
