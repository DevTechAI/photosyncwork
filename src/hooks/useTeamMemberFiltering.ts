
import { useState, useEffect } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { getAvailableTeamMembers, getAssignedTeamMembers } from "@/utils/teamMemberFilterUtils";

export function useTeamMemberFiltering(
  selectedEvent: ScheduledEvent | null,
  teamMembers: TeamMember[]
) {
  // State for filtered members
  const [availablePhotographers, setAvailablePhotographers] = useState<TeamMember[]>([]);
  const [availableVideographers, setAvailableVideographers] = useState<TeamMember[]>([]);
  const [assignedTeamMembers, setAssignedTeamMembers] = useState<Array<{ teamMember?: TeamMember } & any>>([]);
  
  // Update filtered members whenever selectedEvent or teamMembers change
  useEffect(() => {
    // Log inputs for debugging
    console.log("useTeamMemberFiltering - selectedEvent:", selectedEvent);
    console.log("useTeamMemberFiltering - teamMembers:", teamMembers);
    
    if (selectedEvent && teamMembers.length > 0) {
      // Filter team members
      const filteredPhotographers = getAvailableTeamMembers(teamMembers, selectedEvent, "photographer");
      const filteredVideographers = getAvailableTeamMembers(teamMembers, selectedEvent, "videographer");
      const filteredAssignedTeamMembers = getAssignedTeamMembers(selectedEvent, teamMembers);
      
      // Log results for debugging
      console.log("useTeamMemberFiltering - availablePhotographers:", filteredPhotographers);
      console.log("useTeamMemberFiltering - availableVideographers:", filteredVideographers);
      console.log("useTeamMemberFiltering - assignedTeamMembers:", filteredAssignedTeamMembers);
      
      // Update state
      setAvailablePhotographers(filteredPhotographers);
      setAvailableVideographers(filteredVideographers);
      setAssignedTeamMembers(filteredAssignedTeamMembers);
    } else {
      // Reset values if no event is selected
      setAvailablePhotographers([]);
      setAvailableVideographers([]);
      setAssignedTeamMembers([]);
    }
  }, [selectedEvent, teamMembers]);
  
  return {
    availablePhotographers,
    availableVideographers,
    assignedTeamMembers
  };
}
