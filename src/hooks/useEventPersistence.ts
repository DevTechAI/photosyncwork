
import { useEffect } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";

export function useEventPersistence(events: ScheduledEvent[]) {
  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      // Get all existing events first
      const savedEvents = localStorage.getItem("scheduledEvents");
      let allEvents: ScheduledEvent[] = [];
      
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        // Filter out pre-production events that are already in our state
        allEvents = parsedEvents.filter(
          (event: ScheduledEvent) => 
            event.stage !== "pre-production" || 
            !events.some(e => e.id === event.id)
        );
      }
      
      // Add our pre-production events
      localStorage.setItem("scheduledEvents", JSON.stringify([...allEvents, ...events]));
    }
  }, [events]);
}
