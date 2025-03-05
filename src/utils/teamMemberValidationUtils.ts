
import { ScheduledEvent } from "@/components/scheduling/types";

/**
 * Checks if the maximum number of team members for a specific role has been reached
 */
export function hasReachedMaxTeamMembers(
  event: ScheduledEvent, 
  role: "photographer" | "videographer"
): boolean {
  // Get the total number of assignments for this role
  const roleCounts = event.assignments.filter(assignment => {
    // Find accepted or pending assignments for this role
    const isRoleMatch = assignment.notes?.includes(`Assigned as ${role}`);
    const isNotDeclined = assignment.status !== "declined";
    return isRoleMatch && isNotDeclined;
  }).length;
  
  // Compare with the required count from the event
  const requiredCount = role === "photographer" 
    ? event.photographersCount 
    : event.videographersCount;
  
  return roleCounts >= requiredCount;
}

/**
 * Checks if a team member can be assigned to an event based on role limits
 */
export function canAssignTeamMember(
  event: ScheduledEvent, 
  role: "photographer" | "videographer"
): boolean {
  return !hasReachedMaxTeamMembers(event, role);
}
