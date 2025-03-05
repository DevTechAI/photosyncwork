
/**
 * Utilities for converting approved estimates to scheduled events
 */
import { ScheduledEvent } from "../types";
import { getApprovedEstimates } from "./approvedEstimatesLoader";
import { checkEventExistsForEstimateEvent } from "./eventExistenceChecker";
import { createScheduledEventFromEstimateEvent } from "./eventCreator";
import { saveEvent } from "./eventPersistence";

/**
 * Convert approved estimates to events with improved error handling
 * @returns An array of newly created scheduled events
 */
export async function createEventsFromApprovedEstimates(): Promise<ScheduledEvent[]> {
  try {
    console.log("Starting conversion of approved estimates to events");
    
    // Get all approved estimates
    const approvedEstimates = await getApprovedEstimates().catch(error => {
      console.error("Error fetching approved estimates:", error);
      return [];
    });
    
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
