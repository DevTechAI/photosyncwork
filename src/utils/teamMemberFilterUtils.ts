
import { ScheduledEvent, TeamMember, EventAssignment } from "@/components/scheduling/types";

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
