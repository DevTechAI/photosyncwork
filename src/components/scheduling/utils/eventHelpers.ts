import { ScheduledEvent, TeamMember, EventAssignment } from "../types";
import { createEventFromEstimate } from "./estimatesHelpers";
import { supabase } from "@/integrations/supabase/client";
import { dbToScheduledEvent, scheduledEventToDb } from "@/utils/supabaseConverters";
import { v4 as uuidv4 } from 'uuid';

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
    
    // Convert DB records to frontend model
    return (data || []).map(record => dbToScheduledEvent(record));
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
    
    // Convert DB records to frontend model
    return (data || []).map(record => dbToScheduledEvent(record));
  } catch (error) {
    console.error(`Error in getEventsByStage for ${stage}:`, error);
    return [];
  }
}

// Save an event to Supabase
export async function saveEvent(event: ScheduledEvent): Promise<void> {
  try {
    // Convert to DB format
    const dbEvent = scheduledEventToDb(event);
    
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
        .update(dbEvent)
        .eq('id', event.id);
      
      if (error) {
        console.error('Error updating event in Supabase:', error);
      }
    } else {
      // Insert new event
      const { error } = await supabase
        .from('scheduled_events')
        .insert(dbEvent);
      
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
    
    // Convert to frontend model
    const event = dbToScheduledEvent(data);
    
    // Update the event stage
    const updatedEvent = { ...event, stage: newStage };
    
    // Convert back to DB format for update
    const dbEvent = scheduledEventToDb(updatedEvent);
    
    const { error } = await supabase
      .from('scheduled_events')
      .update(dbEvent)
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

// Convert approved estimates to events
export async function createEventsFromApprovedEstimates(): Promise<ScheduledEvent[]> {
  try {
    const savedEstimates = localStorage.getItem("estimates");
    if (!savedEstimates) return [];
    
    const allEstimates = JSON.parse(savedEstimates);
    const approvedEstimates = allEstimates.filter((estimate: any) => estimate.status === "approved");
    
    console.log("Found approved estimates:", approvedEstimates);
    
    const newEvents: ScheduledEvent[] = [];
    
    // Process each approved estimate
    for (const estimate of approvedEstimates) {
      // Check if this estimate already has an event in Supabase
      const { data: existingEvents, error } = await supabase
        .from('scheduled_events')
        .select('id')
        .eq('estimateid', estimate.id);
      
      if (error) {
        console.error('Error checking for existing events in Supabase:', error);
        continue;
      }
      
      if (existingEvents && existingEvents.length > 0) {
        // Event already exists for this estimate
        console.log(`Event already exists for estimate ID ${estimate.id}`);
        continue;
      }
      
      // Create event data from the estimate
      const eventData = createEventFromEstimate(estimate);
      console.log("Created event data from estimate:", eventData);
      
      // Generate a new event with required fields using UUID
      const newEvent: ScheduledEvent = {
        id: uuidv4(),
        estimateId: estimate.id,
        name: eventData.name || `Event for ${estimate.clientName}`,
        date: eventData.date || new Date().toISOString().split('T')[0],
        startTime: "09:00",
        endTime: "17:00",
        location: "To be determined",
        clientName: estimate.clientName,
        clientPhone: estimate.clientPhone || "",
        clientEmail: estimate.clientEmail || "",
        guestCount: eventData.guestCount || "0",
        photographersCount: eventData.photographersCount || 1,
        videographersCount: eventData.videographersCount || 0,
        assignments: [],
        notes: "",
        stage: "pre-production",
        clientRequirements: "",
        references: [],
        timeTracking: [],
        deliverables: eventData.deliverables || [],
        dataCopied: false,
        estimatePackage: eventData.estimatePackage || ""
      };
      
      console.log("About to save new event to Supabase:", newEvent);
      
      // Save the new event to Supabase
      await saveEvent(newEvent);
      
      newEvents.push(newEvent);
    }
    
    return newEvents;
  } catch (error) {
    console.error('Error in createEventsFromApprovedEstimates:', error);
    return [];
  }
}
