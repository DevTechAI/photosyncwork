
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
    if (!savedEstimates) {
      console.log("No estimates found in localStorage");
      return [];
    }
    
    const allEstimates = JSON.parse(savedEstimates);
    console.log("All estimates from localStorage:", allEstimates);
    
    const approvedEstimates = allEstimates.filter((estimate: any) => estimate.status === "approved");
    console.log("Filtered approved estimates:", approvedEstimates);
    return approvedEstimates;
  } catch (error) {
    console.error('Error retrieving approved estimates:', error);
    return [];
  }
}

/**
 * Checks if an event already exists for the given estimate ID and event name
 * @param estimateId The estimate ID to check
 * @param eventName The event name to check
 * @returns Boolean indicating if an event exists
 */
async function checkEventExistsForEstimateEvent(estimateId: string, eventName: string): Promise<boolean> {
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

/**
 * Creates a scheduled event object from an event in an approved estimate
 * @param estimate The approved estimate containing the event
 * @param serviceEvent The individual event data from the estimate's services
 * @returns A new ScheduledEvent object
 */
function createScheduledEventFromEstimateEvent(
  estimate: any, 
  serviceEvent: any,
  selectedPackageIndex: number = 0
): ScheduledEvent {
  try {
    console.log("Creating scheduled event from estimate event:", serviceEvent);
    
    // Determine which package we're working with
    const packageInfo = estimate.packages && estimate.packages.length > selectedPackageIndex 
      ? estimate.packages[selectedPackageIndex] 
      : null;
    
    // Find all deliverables from the selected package
    const deliverables = packageInfo ? packageInfo.deliverables : estimate.deliverables || [];
    
    // Create a new event with required fields using UUID
    const newEvent: ScheduledEvent = {
      id: uuidv4(),
      estimateId: estimate.id,
      name: serviceEvent.event,
      date: serviceEvent.date || new Date().toISOString().split('T')[0],
      startTime: serviceEvent.startTime || "09:00",
      endTime: serviceEvent.endTime || "17:00",
      location: serviceEvent.location || "To be determined",
      clientName: estimate.clientName,
      clientPhone: estimate.clientPhone || "",
      clientEmail: estimate.clientEmail || "",
      guestCount: serviceEvent.guests || "0",
      photographersCount: parseInt(serviceEvent.photographers) || 1,
      videographersCount: parseInt(serviceEvent.cinematographers) || 0,
      assignments: [],
      notes: "",
      stage: "pre-production",
      clientRequirements: "",
      references: [],
      timeTracking: [],
      deliverables: deliverables,
      dataCopied: false,
      estimatePackage: packageInfo ? packageInfo.name || `Option ${selectedPackageIndex + 1}` : ""
    };
    
    console.log("Generated new scheduled event:", newEvent);
    return newEvent;
  } catch (error) {
    console.error('Error creating scheduled event from estimate event:', error);
    throw new Error('Failed to create event from estimate event');
  }
}

// Convert approved estimates to events with improved error handling
export async function createEventsFromApprovedEstimates(): Promise<ScheduledEvent[]> {
  try {
    console.log("Starting conversion of approved estimates to events");
    
    // Get all approved estimates
    const approvedEstimates = getApprovedEstimates();
    console.log(`Found ${approvedEstimates.length} approved estimates`);
    
    if (approvedEstimates.length === 0) {
      console.log("No approved estimates found to convert");
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
        
        console.log(`Processing approved estimate ID: ${estimate.id}`);
        
        // Determine which package was selected (if any)
        const selectedPackageIndex = estimate.selectedPackageIndex || 0;
        
        // Get the services from the selected package
        let services = [];
        if (estimate.packages && estimate.packages.length > selectedPackageIndex) {
          services = estimate.packages[selectedPackageIndex].services || [];
        } else {
          services = estimate.services || [];
        }
        
        console.log(`Found ${services.length} services/events in estimate`, services);
        
        // Create an event for each service/event in the estimate
        for (const serviceEvent of services) {
          try {
            // Skip if event name is missing
            if (!serviceEvent.event) {
              console.warn("Skipping service without event name:", serviceEvent);
              continue;
            }
            
            console.log(`Processing event: ${serviceEvent.event} from estimate ID: ${estimate.id}`);
            
            // Check if this event already exists for this estimate
            const eventExists = await checkEventExistsForEstimateEvent(estimate.id, serviceEvent.event);
            
            if (eventExists) {
              // Event already exists for this estimate
              console.log(`Event ${serviceEvent.event} already exists for estimate ID ${estimate.id}, skipping creation`);
              continue;
            }
            
            console.log(`No existing event found for estimate ID ${estimate.id} and event ${serviceEvent.event}, creating new event`);
            
            // Create a new event from the event in the estimate
            const newEvent = createScheduledEventFromEstimateEvent(estimate, serviceEvent, selectedPackageIndex);
            console.log("Created new event from estimate event:", newEvent);
            
            // Save the new event to Supabase
            await saveEvent(newEvent);
            console.log(`Successfully saved new event to Supabase with ID: ${newEvent.id}`);
            
            newEvents.push(newEvent);
            console.log(`Added new event to return array, total new events: ${newEvents.length}`);
          } catch (eventError) {
            // Log error but continue processing other events
            console.error(`Error processing event ${serviceEvent?.event} in estimate ${estimate?.id}:`, eventError);
          }
        }
      } catch (estimateError) {
        // Log error but continue processing other estimates
        console.error(`Error processing estimate ${estimate?.id}:`, estimateError);
      }
    }
    
    console.log(`Successfully created ${newEvents.length} new events from approved estimates`);
    return newEvents;
  } catch (error) {
    console.error('Error in createEventsFromApprovedEstimates:', error);
    return [];
  }
}
