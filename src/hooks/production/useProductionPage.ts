
import { useState, useEffect } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { useProductionEvents } from "./useProductionEvents";
import { useTeamMembers } from "./useTeamMembers";
import { useProductionTeamAssignment } from "./useProductionTeamAssignment";
import { supabase } from "@/integrations/supabase/client";
import { scheduledEventToDb } from "@/utils/supabaseConverters";

export function useProductionPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tracking");
  
  // Use extracted hooks
  const { events, setEvents, selectedEvent, setSelectedEvent } = useProductionEvents();
  const { teamMembers } = useTeamMembers();
  const { handleAssignTeamMember, handleUpdateAssignmentStatus } = useProductionTeamAssignment(
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent
  );

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
  
  // Log additional time for a team member
  const handleLogTime = (eventId: string, teamMemberId: string, hours: number) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const existingTimeTracking = event.timeTracking || [];
        const today = new Date().toISOString().split('T')[0];
        
        // Check if there's already a time entry for this team member today
        const existingEntryIndex = existingTimeTracking.findIndex(
          entry => entry.teamMemberId === teamMemberId && entry.date === today
        );
        
        if (existingEntryIndex >= 0) {
          // Update existing entry
          const updatedTimeTracking = [...existingTimeTracking];
          updatedTimeTracking[existingEntryIndex] = {
            ...updatedTimeTracking[existingEntryIndex],
            hoursLogged: updatedTimeTracking[existingEntryIndex].hoursLogged + hours
          };
          
          return {
            ...event,
            timeTracking: updatedTimeTracking
          };
        } else {
          // Add new entry
          return {
            ...event,
            timeTracking: [
              ...existingTimeTracking,
              {
                teamMemberId,
                hoursLogged: hours,
                date: today
              }
            ]
          };
        }
      }
      return event;
    }));
    
    // Update selected event if necessary
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(events.find(e => e.id === eventId) || null);
    }
    
    toast({
      title: "Time Logged",
      description: `Successfully logged ${hours} hours.`,
    });
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
    events,
    teamMembers,
    selectedEvent,
    setSelectedEvent,
    activeTab,
    setActiveTab,
    handleUpdateEvent,
    handleLogTime,
    handleUpdateNotes,
    handleMoveToPostProduction,
    handleAssignTeamMember,
    handleUpdateAssignmentStatus
  };
}
