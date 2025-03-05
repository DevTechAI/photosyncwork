
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { getAvailableTeamMembers, getAssignedTeamMembers } from "@/utils/teamAssignmentUtils";

export function useTeamMemberFiltering(
  selectedEvent: ScheduledEvent | null,
  teamMembers: TeamMember[]
) {
  // Log inputs for debugging
  console.log("useTeamMemberFiltering - selectedEvent:", selectedEvent);
  console.log("useTeamMemberFiltering - teamMembers:", teamMembers);
  
  // Filter team members
  const availablePhotographers = getAvailableTeamMembers(teamMembers, selectedEvent, "photographer");
  const availableVideographers = getAvailableTeamMembers(teamMembers, selectedEvent, "videographer");
  const assignedTeamMembers = getAssignedTeamMembers(selectedEvent, teamMembers);
  
  // Log results for debugging
  console.log("useTeamMemberFiltering - availablePhotographers:", availablePhotographers);
  console.log("useTeamMemberFiltering - availableVideographers:", availableVideographers);
  console.log("useTeamMemberFiltering - assignedTeamMembers:", assignedTeamMembers);
  
  return {
    availablePhotographers,
    availableVideographers,
    assignedTeamMembers
  };
}
