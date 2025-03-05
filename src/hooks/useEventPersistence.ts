
import { useEffect } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { saveEvents } from "@/components/scheduling/utils/eventHelpers";

export function useEventPersistence(events: ScheduledEvent[]) {
  // Save events to Supabase whenever they change
  useEffect(() => {
    if (events.length > 0) {
      // Save all pre-production events to Supabase
      const saveToSupabase = async () => {
        try {
          await saveEvents(events);
        } catch (error) {
          console.error("Error saving events to Supabase:", error);
        }
      };
      
      saveToSupabase();
    }
  }, [events]);
}
