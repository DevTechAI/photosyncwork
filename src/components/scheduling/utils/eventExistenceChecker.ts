
/**
 * Utilities for checking existence of scheduled events
 */
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if an event already exists for the given estimate ID and event name
 * @param estimateId The estimate ID to check
 * @param eventName The event name to check
 * @returns Boolean indicating if an event exists
 */
export async function checkEventExistsForEstimateEvent(estimateId: string, eventName: string): Promise<boolean> {
  try {
    console.log(`Checking if event exists for estimate ID: ${estimateId} and event name: ${eventName}`);
    const { data: existingEvents, error } = await supabase
      .from('scheduled_events')
      .select('id')
      .eq('estimateid', estimateId)
      .eq('name', eventName);
    
    if (error) {
      console.error('Error checking for existing events in Supabase:', error);
      return false;
    }
    
    const exists = Boolean(existingEvents && existingEvents.length > 0);
    console.log(`Event exists for estimate ${estimateId} and event name ${eventName}: ${exists}`);
    return exists;
  } catch (error) {
    console.error('Error in checkEventExistsForEstimateEvent:', error);
    return false;
  }
}
