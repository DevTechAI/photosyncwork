
import { useEffect } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";
import { scheduledEventToDb } from "@/utils/supabaseConverters";

export function useEventSync(events: ScheduledEvent[]) {
  // Save events to Supabase whenever they change
  useEffect(() => {
    if (events.length > 0) {
      const saveEvents = async () => {
        try {
          for (const event of events) {
            const dbEvent = scheduledEventToDb(event);
            const { error } = await supabase
              .from('scheduled_events')
              .update(dbEvent)
              .eq('id', event.id);
              
            if (error) {
              console.error(`Error saving event ${event.id} to Supabase:`, error);
            }
          }
        } catch (error) {
          console.error("Error saving events to Supabase:", error);
        }
      };
      
      saveEvents();
      
      // Also update localStorage as fallback
      const savedEvents = localStorage.getItem("scheduledEvents");
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        const filteredEvents = parsedEvents.filter(
          (event: ScheduledEvent) => event.id !== events.find(e => e.id === event.id)?.id
        );
        const allEvents = [...filteredEvents, ...events];
        localStorage.setItem("scheduledEvents", JSON.stringify(allEvents));
      }
    }
  }, [events]);
}
