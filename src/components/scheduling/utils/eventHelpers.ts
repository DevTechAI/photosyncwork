
import { ScheduledEvent, TeamMember, EventAssignment } from "../types";
import { createEventFromEstimate } from "./estimatesHelpers";
import { supabase } from "@/integrations/supabase/client";

// Get all scheduled events
export async function getAllEvents(): Promise<ScheduledEvent[]> {
  try {
    const { data, error } = await supabase
      .from('scheduled_events')
      .select('*');
    
    if (error) {
      console.error('Error fetching events from Supabase:', error);
      return [];
    }
    
    return data as ScheduledEvent[];
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    return [];
  }
}

// Fallback function for when we need to use localStorage (for compatibility)
export function getAllEventsFromLocalStorage(): ScheduledEvent[] {
  const savedEvents = localStorage.getItem("scheduledEvents");
  if (!savedEvents) return [];
  return JSON.parse(savedEvents);
}

// Get events filtered by stage
export async function getEventsByStage(stage: "pre-production" | "production" | "post-production" | "completed"): Promise<ScheduledEvent[]> {
  try {
    const { data, error } = await supabase
      .from('scheduled_events')
      .select('*')
      .eq('stage', stage);
    
    if (error) {
      console.error(`Error fetching ${stage} events from Supabase:`, error);
      return [];
    }
    
    return data as ScheduledEvent[];
  } catch (error) {
    console.error(`Error in getEventsByStage for ${stage}:`, error);
    return [];
  }
}

// Save an event to Supabase
export async function saveEvent(event: ScheduledEvent): Promise<void> {
  try {
    // Check if event already exists
    const { data, error: fetchError } = await supabase
      .from('scheduled_events')
      .select('id')
      .eq('id', event.id)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error checking if event exists in Supabase:', fetchError);
      return;
    }
    
    if (data) {
      // Update existing event
      const { error } = await supabase
        .from('scheduled_events')
        .update(event)
        .eq('id', event.id);
      
      if (error) {
        console.error('Error updating event in Supabase:', error);
      }
    } else {
      // Insert new event
      const { error } = await supabase
        .from('scheduled_events')
        .insert(event);
      
      if (error) {
        console.error('Error inserting event in Supabase:', error);
      }
    }
  } catch (error) {
    console.error('Error in saveEvent:', error);
  }
}

// Save multiple events to Supabase
export async function saveEvents(events: ScheduledEvent[]): Promise<void> {
  try {
    for (const event of events) {
      await saveEvent(event);
    }
  } catch (error) {
    console.error('Error in saveEvents:', error);
  }
}

// Update event stage
export async function updateEventStage(
  eventId: string, 
  newStage: "pre-production" | "production" | "post-production" | "completed"
): Promise<ScheduledEvent | null> {
  try {
    // Fetch the event first
    const { data, error: fetchError } = await supabase
      .from('scheduled_events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching event from Supabase:', fetchError);
      return null;
    }
    
    if (!data) {
      console.error('Event not found in Supabase:', eventId);
      return null;
    }
    
    // Update the event stage
    const updatedEvent = { ...data, stage: newStage } as ScheduledEvent;
    
    const { error } = await supabase
      .from('scheduled_events')
      .update(updatedEvent)
      .eq('id', eventId);
    
    if (error) {
      console.error('Error updating event stage in Supabase:', error);
      return null;
    }
    
    return updatedEvent;
  } catch (error) {
    console.error('Error in updateEventStage:', error);
    return null;
  }
}

// Convert approved estimates to events (this still uses localStorage for compatibility)
export function createEventsFromApprovedEstimates(): ScheduledEvent[] {
  const savedEstimates = localStorage.getItem("estimates");
  if (!savedEstimates) return [];
  
  const allEstimates = JSON.parse(savedEstimates);
  const approvedEstimates = allEstimates.filter(estimate => estimate.status === "approved");
  
  const newEvents: ScheduledEvent[] = [];
  
  // Process each approved estimate
  approvedEstimates.forEach(async (estimate) => {
    // Check if this estimate already has an event in Supabase
    const { data: existingEvents, error } = await supabase
      .from('scheduled_events')
      .select('id')
      .eq('estimateId', estimate.id);
    
    if (error) {
      console.error('Error checking for existing events in Supabase:', error);
      return;
    }
    
    if (existingEvents && existingEvents.length > 0) {
      // Event already exists for this estimate
      return;
    }
    
    // Create event data from the estimate
    const eventData = createEventFromEstimate(estimate);
    
    // Generate a new event with required fields
    const newEvent: ScheduledEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      estimateId: estimate.id,
      name: eventData.name || `Event for ${estimate.clientName}`,
      date: eventData.date || new Date().toISOString().split('T')[0],
      startTime: "09:00",
      endTime: "17:00",
      location: "To be determined",
      clientName: estimate.clientName,
      clientPhone: "",
      clientEmail: estimate.clientEmail || "",
      photographersCount: eventData.photographersCount || 1,
      videographersCount: eventData.videographersCount || 1,
      assignments: [],
      stage: "pre-production",
      clientRequirements: "",
      deliverables: eventData.deliverables || [],
      estimatePackage: eventData.estimatePackage || ""
    };
    
    // Save the new event to Supabase
    saveEvent(newEvent);
    
    newEvents.push(newEvent);
  });
  
  return newEvents;
}
