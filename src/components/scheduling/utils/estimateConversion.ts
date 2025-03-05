
import { ScheduledEvent } from "../types";
import { createEventFromEstimate } from "./estimatesHelpers";
import { supabase } from "@/integrations/supabase/client";
import { saveEvent } from "./eventPersistence";
import { v4 as uuidv4 } from 'uuid';

/**
 * Retrieves all approved estimates from local storage
 * @returns Array of approved estimates
 */
function getApprovedEstimates(): any[] {
  try {
    const savedEstimates = localStorage.getItem("estimates");
    if (!savedEstimates) return [];
    
    const allEstimates = JSON.parse(savedEstimates);
    return allEstimates.filter((estimate: any) => estimate.status === "approved");
  } catch (error) {
    console.error('Error retrieving approved estimates:', error);
    return [];
  }
}

/**
 * Checks if an event already exists for the given estimate ID
 * @param estimateId The estimate ID to check
 * @returns Boolean indicating if an event exists
 */
async function checkEventExistsForEstimate(estimateId: string): Promise<boolean> {
  try {
    const { data: existingEvents, error } = await supabase
      .from('scheduled_events')
      .select('id')
      .eq('estimateid', estimateId);
    
    if (error) {
      console.error('Error checking for existing events in Supabase:', error);
      return false;
    }
    
    return Boolean(existingEvents && existingEvents.length > 0);
  } catch (error) {
    console.error('Error in checkEventExistsForEstimate:', error);
    return false;
  }
}

/**
 * Creates a scheduled event object from an approved estimate
 * @param estimate The approved estimate to convert
 * @returns A new ScheduledEvent object
 */
function createScheduledEventFromEstimate(estimate: any): ScheduledEvent {
  try {
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
    
    return newEvent;
  } catch (error) {
    console.error('Error creating scheduled event from estimate:', error);
    throw new Error('Failed to create event from estimate');
  }
}

// Convert approved estimates to events with improved error handling
export async function createEventsFromApprovedEstimates(): Promise<ScheduledEvent[]> {
  try {
    // Get all approved estimates
    const approvedEstimates = getApprovedEstimates();
    console.log("Found approved estimates:", approvedEstimates);
    
    if (approvedEstimates.length === 0) {
      console.log("No approved estimates found");
      return [];
    }
    
    const newEvents: ScheduledEvent[] = [];
    
    // Process each approved estimate
    for (const estimate of approvedEstimates) {
      try {
        // Skip estimates without an ID
        if (!estimate.id) {
          console.warn("Skipping estimate without ID:", estimate);
          continue;
        }
        
        // Check if this estimate already has an event
        const eventExists = await checkEventExistsForEstimate(estimate.id);
        
        if (eventExists) {
          // Event already exists for this estimate
          console.log(`Event already exists for estimate ID ${estimate.id}`);
          continue;
        }
        
        // Create a new event from the estimate
        const newEvent = createScheduledEventFromEstimate(estimate);
        console.log("Created new event from estimate:", newEvent);
        
        // Save the new event to Supabase
        await saveEvent(newEvent);
        console.log("Successfully saved new event to Supabase:", newEvent.id);
        
        newEvents.push(newEvent);
      } catch (estimateError) {
        // Log error but continue processing other estimates
        console.error(`Error processing estimate ${estimate?.id}:`, estimateError);
      }
    }
    
    return newEvents;
  } catch (error) {
    console.error('Error in createEventsFromApprovedEstimates:', error);
    return [];
  }
}
