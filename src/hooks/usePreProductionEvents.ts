
import { useState, useEffect } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { createEventsFromApprovedEstimates, getEventsByStage, getAllEvents } from "@/components/scheduling/utils/eventHelpers";
import { processEventsWorkflow } from "@/utils/teamAssignmentUtils";

export function usePreProductionEvents() {
  const { toast } = useToast();
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [completedEvents, setCompletedEvents] = useState<ScheduledEvent[]>([]);
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
    let preProductionEvents = getEventsByStage("pre-production");
    
    // Get events that were previously in pre-production but have moved to production
    const allEvents = getAllEvents();
    const movedEvents = allEvents.filter(event => 
      event.stage === "production" && 
      event.dataCopied === true
    );
    
    // Process events based on dates - this will move events to the next stage if needed
    preProductionEvents = processEventsWorkflow(preProductionEvents);
    
    // Set pre-production events in the state
    setEvents(preProductionEvents);
    setCompletedEvents(movedEvents);
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

  // Delete a completed pre-production event
  const deleteCompletedEvent = (eventId: string) => {
    // Filter out the event to be deleted
    const updatedCompletedEvents = completedEvents.filter(event => event.id !== eventId);
    
    // Get all events from localStorage
    const allEvents = getAllEvents();
    
    // Update the event in localStorage by setting dataCopied to false
    const updatedAllEvents = allEvents.map(event => {
      if (event.id === eventId) {
        return { ...event, dataCopied: false };
      }
      return event;
    });
    
    // Save back to localStorage
    localStorage.setItem("scheduledEvents", JSON.stringify(updatedAllEvents));
    
    // Update state
    setCompletedEvents(updatedCompletedEvents);
    
    // Show toast notification
    toast({
      title: "Event Deleted",
      description: "The event reference has been deleted"
    });
  };

  return {
    events, 
    setEvents,
    completedEvents,
    selectedEvent,
    setSelectedEvent,
    deleteCompletedEvent
  };
}
