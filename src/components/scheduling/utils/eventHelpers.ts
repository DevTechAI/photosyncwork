
import { ScheduledEvent, TeamMember, EventAssignment } from "../types";

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

// Update assignment status
export function updateAssignmentStatus(
  eventId: string, 
  teamMemberId: string, 
  status: "pending" | "accepted" | "declined" | "reassigned"
): ScheduledEvent | null {
  const allEvents = getAllEvents();
  const eventIndex = allEvents.findIndex(e => e.id === eventId);
  
  if (eventIndex >= 0) {
    const event = allEvents[eventIndex];
    const assignmentIndex = event.assignments.findIndex(
      a => a.teamMemberId === teamMemberId && a.eventId === eventId
    );
    
    if (assignmentIndex >= 0) {
      const updatedAssignments = [...event.assignments];
      updatedAssignments[assignmentIndex] = {
        ...updatedAssignments[assignmentIndex],
        status
      };
      
      const updatedEvent = {
        ...event,
        assignments: updatedAssignments
      };
      
      allEvents[eventIndex] = updatedEvent;
      localStorage.setItem("scheduledEvents", JSON.stringify(allEvents));
      
      return updatedEvent;
    }
  }
  
  return null;
}

// Check if all photographers and videographers have accepted their assignments
export function areAllTeamMembersConfirmed(event: ScheduledEvent, teamMembers: TeamMember[]): boolean {
  const photographerAssignments = event.assignments.filter(
    a => teamMembers.find(tm => tm.id === a.teamMemberId)?.role === "photographer"
  );
  
  const videographerAssignments = event.assignments.filter(
    a => teamMembers.find(tm => tm.id === a.teamMemberId)?.role === "videographer"
  );
  
  return (
    photographerAssignments.length >= event.photographersCount &&
    videographerAssignments.length >= event.videographersCount &&
    photographerAssignments.every(a => a.status === "accepted") &&
    videographerAssignments.every(a => a.status === "accepted")
  );
}
