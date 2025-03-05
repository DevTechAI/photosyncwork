
import { ScheduledEvent } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { dbToScheduledEvent } from "@/utils/supabaseConverters";

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
