
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";

/**
 * Get counts of team members by role and status for an event
 */
export function getAssignmentCounts(event: ScheduledEvent, teamMembers: TeamMember[]) {
  const acceptedPhotographers = event.assignments.filter(
    a => {
      const member = teamMembers.find(m => m.id === a.teamMemberId);
      return member?.role === "photographer" && a.status === "accepted";
    }
  ).length;

  const acceptedVideographers = event.assignments.filter(
    a => {
      const member = teamMembers.find(m => m.id === a.teamMemberId);
      return member?.role === "videographer" && a.status === "accepted";
    }
  ).length;

  const pendingPhotographers = event.assignments.filter(
    a => {
      const member = teamMembers.find(m => m.id === a.teamMemberId);
      return member?.role === "photographer" && a.status === "pending";
    }
  ).length;

  const pendingVideographers = event.assignments.filter(
    a => {
      const member = teamMembers.find(m => m.id === a.teamMemberId);
      return member?.role === "videographer" && a.status === "pending";
    }
  ).length;

  return {
    acceptedPhotographers,
    acceptedVideographers,
    pendingPhotographers,
    pendingVideographers,
    totalPhotographers: acceptedPhotographers + pendingPhotographers,
    totalVideographers: acceptedVideographers + pendingVideographers
  };
}
