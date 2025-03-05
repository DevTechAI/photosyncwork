
import { ScheduledEvent } from "../types";
import { createEventFromEstimate } from "./estimatesHelpers";
import { supabase } from "@/integrations/supabase/client";
import { saveEvent } from "./eventPersistence";
import { v4 as uuidv4 } from 'uuid';

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
