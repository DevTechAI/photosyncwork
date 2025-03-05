
import { useState } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { useTeamAssignmentHandlers, getAvailableTeamMembers, getAssignedTeamMembers } from "@/utils/teamAssignmentUtils";
import { useToast } from "@/components/ui/use-toast";

export function useTeamAssignmentsTab(
  events: ScheduledEvent[],
  setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>,
  selectedEvent: ScheduledEvent | null,
  setSelectedEvent: React.Dispatch<React.SetStateAction<ScheduledEvent | null>>,
  teamMembers: TeamMember[]
) {
  const { toast } = useToast();
  const { 
    loading, 
    handleAssignTeamMember, 
    handleMoveToProduction 
  } = useTeamAssignmentHandlers(events, setEvents, selectedEvent, setSelectedEvent, teamMembers);
  
  // Filter team members
  const availablePhotographers = getAvailableTeamMembers(teamMembers, selectedEvent, "photographer");
  const availableVideographers = getAvailableTeamMembers(teamMembers, selectedEvent, "videographer");
  const assignedTeamMembers = getAssignedTeamMembers(selectedEvent, teamMembers);
  
  // Handle updating assignment status
  const handleUpdateAssignmentStatus = (eventId: string, teamMemberId: string, status: "accepted" | "declined") => {
    if (!selectedEvent) return;
    
    // This eventId should match the selectedEvent.id
    if (eventId !== selectedEvent.id) {
      console.error("Event ID mismatch in handleUpdateAssignmentStatus");
      return;
    }
    
    const updatedAssignments = selectedEvent.assignments.map(assignment => {
      if (assignment.teamMemberId === teamMemberId) {
        return { ...assignment, status };
      }
      return assignment;
    });
    
    const updatedEvent = { ...selectedEvent, assignments: updatedAssignments };
    
    // Update events array
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    
    // Save to localStorage to persist changes
    try {
      localStorage.setItem('preProductionEvents', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
    
    // Update state
    setEvents(updatedEvents);
    setSelectedEvent(updatedEvent);
    
    // Get team member details for notification
    const teamMember = teamMembers.find(m => m.id === teamMemberId);
    
    // Show toast notification
    toast({
      title: `Assignment ${status}`,
      description: teamMember ? 
        `${teamMember.name} has ${status} the assignment for ${selectedEvent.name}` : 
        `Assignment for ${selectedEvent.name} has been ${status}`
    });
  };
  
  return {
    loading,
    availablePhotographers,
    availableVideographers,
    assignedTeamMembers,
    handleAssignTeamMember,
    handleMoveToProduction,
    handleUpdateAssignmentStatus
  };
}
