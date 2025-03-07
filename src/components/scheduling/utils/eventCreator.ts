
/**
 * Utilities for creating scheduled events
 */
import { ScheduledEvent } from "../types";
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a scheduled event object from an event in an approved estimate
 * @param estimate The approved estimate containing the event
 * @param serviceEvent The individual event data from the estimate's services
 * @returns A new ScheduledEvent object
 */
export function createScheduledEventFromEstimateEvent(
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
    let deliverables = [];
    
    if (packageInfo && packageInfo.deliverables) {
      // Get deliverables from the selected package
      deliverables = packageInfo.deliverables.map((item: string) => ({
        id: uuidv4(),
        type: item.toLowerCase().includes('photo') ? 'photos' : 
              item.toLowerCase().includes('video') ? 'videos' : 
              item.toLowerCase().includes('album') ? 'album' : 'photos',
        status: 'pending',
      }));
    } else if (estimate.deliverables) {
      // Fallback to the estimate's deliverables for backward compatibility
      deliverables = estimate.deliverables.map((item: string) => ({
        id: uuidv4(),
        type: item.toLowerCase().includes('photo') ? 'photos' : 
              item.toLowerCase().includes('video') ? 'videos' : 
              item.toLowerCase().includes('album') ? 'album' : 'photos',
        status: 'pending',
      }));
    }
    
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
