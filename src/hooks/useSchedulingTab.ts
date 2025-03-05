
import { useState } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";

export function useSchedulingTab(
  events: ScheduledEvent[],
  setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>,
  teamMembers: TeamMember[]
) {
  const { toast } = useToast();
  
  // Function to get assignment counts for each event
  const getAssignmentCounts = (event: ScheduledEvent) => {
    const acceptedPhotographers = event.assignments.filter(a => 
      a.status === "accepted" && teamMembers.find(m => m.id === a.teamMemberId)?.role === "photographer"
    ).length;
    
    const acceptedVideographers = event.assignments.filter(a => 
      a.status === "accepted" && teamMembers.find(m => m.id === a.teamMemberId)?.role === "videographer"
    ).length;
    
    const pendingPhotographers = event.assignments.filter(a => 
      a.status === "pending" && teamMembers.find(m => m.id === a.teamMemberId)?.role === "photographer"
    ).length;
    
    const pendingVideographers = event.assignments.filter(a => 
      a.status === "pending" && teamMembers.find(m => m.id === a.teamMemberId)?.role === "videographer"
    ).length;
    
    const totalPhotographers = acceptedPhotographers + pendingPhotographers;
    const totalVideographers = acceptedVideographers + pendingVideographers;
    
    return {
      acceptedPhotographers,
      acceptedVideographers,
      pendingPhotographers,
      pendingVideographers,
      totalPhotographers,
      totalVideographers
    };
  };
  
  // Function to assign team members to events
  const handleAssignTeamMemberForScheduling = (eventId: string, teamMemberId: string, role: string) => {
    try {
      // Find the event
      const event = events.find(e => e.id === eventId);
      if (!event) {
        console.error("Event not found");
        return;
      }
      
      // Find the team member
      const teamMember = teamMembers.find(m => m.id === teamMemberId);
      if (!teamMember) {
        console.error("Team member not found");
        return;
      }
      
      // Create a new assignment
      const newAssignment = {
        eventId,
        eventName: event.name,
        date: event.date,
        location: event.location,
        teamMemberId,
        status: "pending" as const,
        notes: `Assigned as ${role}`
      };
      
      // Check if member is already assigned
      const isAlreadyAssigned = event.assignments.some(a => a.teamMemberId === teamMemberId);
      if (isAlreadyAssigned) {
        toast({
          title: "Already assigned",
          description: `${teamMember.name} is already assigned to this event`,
          variant: "destructive"
        });
        return;
      }
      
      // Add assignment to event
      const updatedEvent = {
        ...event,
        assignments: [...event.assignments, newAssignment]
      };
      
      // Update events array
      const updatedEvents = events.map(e => e.id === eventId ? updatedEvent : e);
      
      // Save to localStorage
      try {
        localStorage.setItem('preProductionEvents', JSON.stringify(updatedEvents));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      // Update state
      setEvents(updatedEvents);
      
      // Show toast notification
      toast({
        title: "Team member assigned",
        description: `${teamMember.name} has been assigned to ${event.name}`
      });
      
    } catch (error) {
      console.error("Error assigning team member:", error);
      toast({
        title: "Error",
        description: "Failed to assign team member",
        variant: "destructive"
      });
    }
  };
  
  // Function to update assignment status
  const handleUpdateSchedulingStatus = (eventId: string, teamMemberId: string, status: "accepted" | "declined") => {
    try {
      // Find the event
      const event = events.find(e => e.id === eventId);
      if (!event) {
        console.error("Event not found");
        return;
      }
      
      // Find the team member
      const teamMember = teamMembers.find(m => m.id === teamMemberId);
      if (!teamMember) {
        console.error("Team member not found");
        return;
      }
      
      // Update assignment status
      const updatedAssignments = event.assignments.map(assignment => {
        if (assignment.teamMemberId === teamMemberId) {
          return { ...assignment, status };
        }
        return assignment;
      });
      
      // Update event
      const updatedEvent = {
        ...event,
        assignments: updatedAssignments
      };
      
      // Update events array
      const updatedEvents = events.map(e => e.id === eventId ? updatedEvent : e);
      
      // Save to localStorage
      try {
        localStorage.setItem('preProductionEvents', JSON.stringify(updatedEvents));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      // Update state
      setEvents(updatedEvents);
      
      // Show toast notification
      toast({
        title: `Assignment ${status}`,
        description: `${teamMember.name} has ${status} the assignment for ${event.name}`
      });
      
    } catch (error) {
      console.error("Error updating assignment status:", error);
      toast({
        title: "Error",
        description: "Failed to update assignment status",
        variant: "destructive"
      });
    }
  };
  
  return {
    getAssignmentCounts,
    handleAssignTeamMemberForScheduling,
    handleUpdateSchedulingStatus
  };
}
