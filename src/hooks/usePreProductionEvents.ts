
import { useState } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useEventLoader } from "./useEventLoader";
import { useEventStorage } from "./useEventStorage";
import { useEventPersistence } from "./useEventPersistence";

export function usePreProductionEvents() {
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  
  // Use our composable hooks
  const { 
    isLoading,
    preProductionEvents: events, 
    completedEvents,
    setPreProductionEvents: setEvents,
    setCompletedEvents,
    loadEvents // Make sure to destructure this
  } = useEventLoader();
  
  const { deleteCompletedEvent } = useEventStorage();
  
  // Persist events to localStorage
  useEventPersistence(events);
  
  // Handle deleting a completed event
  const handleDeleteCompletedEvent = async (eventId: string) => {
    const updatedCompletedEvents = await deleteCompletedEvent(eventId);
    setCompletedEvents(updatedCompletedEvents);
  };

  return {
    isLoading,
    events, 
    setEvents,
    completedEvents,
    selectedEvent,
    setSelectedEvent,
    deleteCompletedEvent: handleDeleteCompletedEvent,
    loadEvents // Add this to the return object
  };
}
