
import { useState } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { scheduledEventToDb } from "@/utils/supabaseConverters";

export function useEventUpdates(
  events: ScheduledEvent[],
  setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>,
  selectedEvent: ScheduledEvent | null,
  setSelectedEvent: React.Dispatch<React.SetStateAction<ScheduledEvent | null>>
) {
  const { toast } = useToast();

  // Update an event
  const handleUpdateEvent = (updatedEvent: ScheduledEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    
    // Update selected event as well
    if (selectedEvent && selectedEvent.id === updatedEvent.id) {
      setSelectedEvent(updatedEvent);
    }
  };

  // Update event notes
  const handleUpdateNotes = (eventId: string, notes: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, notes } : event
    ));
    
    // Update selected event if necessary
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(prev => prev ? { ...prev, notes } : null);
    }
    
    toast({
      title: "Notes Saved",
      description: "Production notes have been updated.",
    });
  };

  // Move event to post-production
  const handleMoveToPostProduction = (eventId: string) => {
    const eventToMove = events.find(e => e.id === eventId);
    if (!eventToMove) return;
    
    // Update the event stage
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, stage: "post-production" as const } : event
    );
    
    setEvents(prev => prev.filter(event => event.id !== eventId));
    
    // Update all events in Supabase
    const saveEvents = async () => {
      try {
        for (const event of updatedEvents) {
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
    
    // Update all events in localStorage
    const savedEvents = localStorage.getItem("scheduledEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      const filteredEvents = parsedEvents.filter(
        (event: ScheduledEvent) => event.id !== eventId
      );
      const allEvents = [...filteredEvents, {...eventToMove, stage: "post-production"}];
      localStorage.setItem("scheduledEvents", JSON.stringify(allEvents));
    }
    
    // Update selected event or clear selection if it was moved
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(null);
    }
    
    toast({
      title: "Event Moved",
      description: `${eventToMove.name} has been moved to post-production.`,
    });
  };

  return {
    handleUpdateEvent,
    handleUpdateNotes,
    handleMoveToPostProduction
  };
}
