
import { ScheduledEvent } from "@/components/scheduling/types";

// Function to process events and move them to the next stage based on the date
export const processEventsWorkflow = (events: ScheduledEvent[]): ScheduledEvent[] => {
  return events.map(event => {
    const eventDate = new Date(event.date);
    const today = new Date();

    // If the event date is in the past, move it to the next stage
    if (eventDate < today) {
      switch (event.stage) {
        case "pre-production":
          return { ...event, stage: "production" };
        case "production":
          return { ...event, stage: "post-production" };
        case "post-production":
          return { ...event, stage: "completed" };
        default:
          return event;
      }
    }

    return event;
  });
};
