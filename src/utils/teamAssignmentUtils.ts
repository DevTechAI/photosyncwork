
import { ScheduledEvent, TeamMember, EventAssignment } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { saveEvents, saveEvent } from "@/components/scheduling/utils/eventHelpers";

// Function to filter available team members based on role and availability
export const getAvailableTeamMembers = (
  teamMembers: TeamMember[],
  selectedEvent: ScheduledEvent | null,
  role: "photographer" | "videographer"
): TeamMember[] => {
  if (!selectedEvent) return [];

  const eventDate = selectedEvent.date;

  return teamMembers.filter(member => {
    // Check if member's role matches
    const roleMatches = member.role === role;

    // Check if member is available on the event date
    const isAvailable = !member.availability[eventDate] ||
      member.availability[eventDate] === "available";

    // Check if member is not already assigned to this event
    const isNotAssigned = !selectedEvent.assignments.some(
      assignment => assignment.teamMemberId === member.id
    );

    return roleMatches && isAvailable && isNotAssigned;
  });
};

// Function to get assigned team members for an event
export const getAssignedTeamMembers = (
  selectedEvent: ScheduledEvent | null,
  teamMembers: TeamMember[]
): Array<{ teamMember?: TeamMember } & EventAssignment> => {
  if (!selectedEvent) return [];

  return selectedEvent.assignments.map(assignment => {
    const teamMember = teamMembers.find(member => member.id === assignment.teamMemberId);
    return { ...assignment, teamMember };
  });
};

// Mock function to simulate sending assignment notification
const sendAssignmentNotification = (teamMember: TeamMember, event: ScheduledEvent) => {
  console.log(`Sending notification to ${teamMember.name} for event ${event.name}`);
  // In a real application, you would use an actual notification service
};

// Function to process events and move them to the next stage based on the date
export const processEventsWorkflow = (events: ScheduledEvent[]): ScheduledEvent[] => {
  return events.map(event => {
    const eventDate = new Date(event.date);
    const today = new Date();

    // If the event date is in the past, move it to the next stage
    if (eventDate < today) {
      switch (event.stage) {
        case "pre-production":
          return { ...event, stage: "production" };
        case "production":
          return { ...event, stage: "post-production" };
        case "post-production":
          return { ...event, stage: "completed" };
        default:
          return event;
      }
    }

    return event;
  });
};

// Update this function to mark events as dataCopied when moved to production
export function useTeamAssignmentHandlers(
  events: ScheduledEvent[],
  setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>,
  selectedEvent: ScheduledEvent | null,
  setSelectedEvent: React.Dispatch<React.SetStateAction<ScheduledEvent | null>>,
  teamMembers: TeamMember[]
) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Assign team member to the selected event
  const handleAssignTeamMember = async (teamMemberId: string, role: "photographer" | "videographer") => {
    if (!selectedEvent) return;
    
    setLoading(true);
    
    try {
      // Find team member
      const teamMember = teamMembers.find(member => member.id === teamMemberId);
      if (!teamMember) throw new Error("Team member not found");
      
      // Create a new assignment
      const newAssignment: EventAssignment = {
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        date: selectedEvent.date,
        location: selectedEvent.location,
        teamMemberId: teamMemberId,
        status: "pending",
        notes: `Assigned as ${role}`
      };
      
      // Add assignment to event
      const updatedEvent = {
        ...selectedEvent,
        assignments: [...selectedEvent.assignments, newAssignment]
      };
      
      // Update events array
      const updatedEvents = events.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      );
      
      // Save to localStorage - using both methods to ensure data is saved
      saveEvents(updatedEvents);
      try {
        localStorage.setItem('preProductionEvents', JSON.stringify(updatedEvents));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      // Update state
      setEvents(updatedEvents);
      setSelectedEvent(updatedEvent);
      
      // Show toast notification
      toast({
        title: "Team Member Assigned",
        description: `${teamMember.name} has been assigned as a ${role}`
      });
      
      // Send notification to team member
      sendAssignmentNotification(teamMember, updatedEvent);
    } catch (error) {
      console.error("Error assigning team member:", error);
      toast({
        title: "Error assigning team member",
        description: "An error occurred while assigning the team member",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Move event to production stage
  const handleMoveToProduction = async () => {
    if (!selectedEvent) return;
    
    setLoading(true);
    
    try {
      // Update event stage
      const updatedEvent = {
        ...selectedEvent,
        stage: "production" as const,
        dataCopied: true // Mark event as copied for reference
      };
      
      // Update events array
      const updatedEvents = events.filter(event => event.id !== updatedEvent.id);
      
      // Update localStorage - using both methods to ensure data is saved
      saveEvent(updatedEvent);
      try {
        localStorage.setItem('preProductionEvents', JSON.stringify(updatedEvents));
        
        // Also save to production events
        const productionEvents = JSON.parse(localStorage.getItem('productionEvents') || '[]');
        localStorage.setItem('productionEvents', JSON.stringify([...productionEvents, updatedEvent]));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      // Update state
      setEvents(updatedEvents);
      setSelectedEvent(null);
      
      // Show toast notification
      toast({
        title: "Event Moved to Production",
        description: `${updatedEvent.name} has been moved to the production stage`
      });
    } catch (error) {
      console.error("Error moving event to production:", error);
      toast({
        title: "Error moving event",
        description: "An error occurred while moving the event to production",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return { loading, handleAssignTeamMember, handleMoveToProduction };
}
