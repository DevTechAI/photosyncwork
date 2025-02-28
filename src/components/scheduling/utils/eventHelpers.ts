
import { ScheduledEvent, TeamMember, EventAssignment } from "../types";
import { createEventFromEstimate } from "./estimatesHelpers";

// Get all scheduled events from localStorage
export function getAllEvents(): ScheduledEvent[] {
  const savedEvents = localStorage.getItem("scheduledEvents");
  if (!savedEvents) return [];
  return JSON.parse(savedEvents);
}

// Get events filtered by stage
export function getEventsByStage(stage: "pre-production" | "production" | "post-production" | "completed"): ScheduledEvent[] {
  const allEvents = getAllEvents();
  return allEvents.filter(event => event.stage === stage);
}

// Save an event to localStorage
export function saveEvent(event: ScheduledEvent): void {
  const allEvents = getAllEvents();
  
  // Check if event already exists
  const eventIndex = allEvents.findIndex(e => e.id === event.id);
  
  if (eventIndex >= 0) {
    // Update existing event
    allEvents[eventIndex] = event;
  } else {
    // Add new event
    allEvents.push(event);
  }
  
  localStorage.setItem("scheduledEvents", JSON.stringify(allEvents));
}

// Save multiple events to localStorage
export function saveEvents(events: ScheduledEvent[]): void {
  const allEvents = getAllEvents();
  
  // Create a map of existing events by ID
  const eventMap = new Map<string, ScheduledEvent>();
  allEvents.forEach(event => eventMap.set(event.id, event));
  
  // Update or add new events
  events.forEach(event => eventMap.set(event.id, event));
  
  localStorage.setItem("scheduledEvents", JSON.stringify(Array.from(eventMap.values())));
}

// Update event stage
export function updateEventStage(eventId: string, newStage: "pre-production" | "production" | "post-production" | "completed"): ScheduledEvent | null {
  const allEvents = getAllEvents();
  const eventIndex = allEvents.findIndex(e => e.id === eventId);
  
  if (eventIndex >= 0) {
    const updatedEvent = {
      ...allEvents[eventIndex],
      stage: newStage
    };
    
    allEvents[eventIndex] = updatedEvent;
    localStorage.setItem("scheduledEvents", JSON.stringify(allEvents));
    
    return updatedEvent;
  }
  
  return null;
}

// Convert approved estimates to events
export function createEventsFromApprovedEstimates(): ScheduledEvent[] {
  const savedEstimates = localStorage.getItem("estimates");
  if (!savedEstimates) return [];
  
  const allEstimates = JSON.parse(savedEstimates);
  const approvedEstimates = allEstimates.filter(estimate => estimate.status === "approved");
  
  const allEvents = getAllEvents();
  const newEvents: ScheduledEvent[] = [];
  
  // Process each approved estimate
  approvedEstimates.forEach(estimate => {
    // Check if this estimate already has an event
    const existingEvent = allEvents.find(event => event.estimateId === estimate.id);
    
    if (!existingEvent) {
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
      
      newEvents.push(newEvent);
    }
  });
  
  // Save new events if any were created
  if (newEvents.length > 0) {
    const updatedAllEvents = [...allEvents, ...newEvents];
    localStorage.setItem("scheduledEvents", JSON.stringify(updatedAllEvents));
  }
  
  return newEvents;
}
