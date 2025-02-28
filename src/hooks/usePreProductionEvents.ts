
import { useState, useEffect } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { createEventsFromApprovedEstimates, getEventsByStage } from "@/components/scheduling/utils/eventHelpers";

export function usePreProductionEvents() {
  const { toast } = useToast();
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  
  // Load events from localStorage on mount and check for approved estimates
  useEffect(() => {
    // First, check for any approved estimates that need to be converted to events
    const newEvents = createEventsFromApprovedEstimates();
    
    if (newEvents.length > 0) {
      toast({
        title: "New Events Created",
        description: `${newEvents.length} new event(s) created from approved estimates.`
      });
    }
    
    // Get all pre-production events
    const preProductionEvents = getEventsByStage("pre-production");
    setEvents(preProductionEvents);
  }, [toast]);
  
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

  return {
    events, 
    setEvents,
    selectedEvent,
    setSelectedEvent
  };
}
