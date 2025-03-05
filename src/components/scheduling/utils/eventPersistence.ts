
import { ScheduledEvent } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { dbToScheduledEvent, scheduledEventToDb } from "@/utils/supabaseConverters";

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
