
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { getAvailableTeamMembers, getAssignedTeamMembers } from "@/utils/teamAssignmentUtils";

export function useTeamMemberFiltering(
  selectedEvent: ScheduledEvent | null,
  teamMembers: TeamMember[]
) {
  // Filter team members
  const availablePhotographers = getAvailableTeamMembers(teamMembers, selectedEvent, "photographer");
  const availableVideographers = getAvailableTeamMembers(teamMembers, selectedEvent, "videographer");
  const assignedTeamMembers = getAssignedTeamMembers(selectedEvent, teamMembers);
  
  return {
    availablePhotographers,
    availableVideographers,
    assignedTeamMembers
  };
}
