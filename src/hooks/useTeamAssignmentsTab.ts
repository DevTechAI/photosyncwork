
import { useState } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { useTeamAssignmentHandlers, getAvailableTeamMembers, getAssignedTeamMembers } from "@/utils/teamAssignmentUtils";

export function useTeamAssignmentsTab(
  events: ScheduledEvent[],
  setEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>,
  selectedEvent: ScheduledEvent | null,
  setSelectedEvent: React.Dispatch<React.SetStateAction<ScheduledEvent | null>>,
  teamMembers: TeamMember[]
) {
  const { 
    loading, 
    handleAssignTeamMember, 
    handleMoveToProduction 
  } = useTeamAssignmentHandlers(events, setEvents, selectedEvent, setSelectedEvent, teamMembers);
  
  // Filter team members
  const availablePhotographers = getAvailableTeamMembers(teamMembers, selectedEvent, "photographer");
  const availableVideographers = getAvailableTeamMembers(teamMembers, selectedEvent, "videographer");
  const assignedTeamMembers = getAssignedTeamMembers(selectedEvent, teamMembers);
  
  return {
    loading,
    availablePhotographers,
    availableVideographers,
    assignedTeamMembers,
    handleAssignTeamMember,
    handleMoveToProduction
  };
}
