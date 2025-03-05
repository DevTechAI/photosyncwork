
import { useState } from "react";
import { ScheduledEvent, TeamMember, EventAssignment } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { saveEvents, saveEvent } from "@/components/scheduling/utils/eventHelpers";
import { sendAssignmentNotification } from "@/utils/notificationUtils";

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
      const updatedEvent: ScheduledEvent = {
        ...selectedEvent,
        stage: "production",
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
