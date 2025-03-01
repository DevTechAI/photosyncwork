
import { ScheduledEvent, TeamMember } from "../types";

export interface AssignmentCounts {
  acceptedPhotographers: number;
  acceptedVideographers: number;
  pendingPhotographers: number;
  pendingVideographers: number;
  totalPhotographers: number;
  totalVideographers: number;
}

export interface EventAssignmentsProps {
  events: ScheduledEvent[];
  teamMembers: TeamMember[];
  onAssign: (eventId: string, teamMemberId: string, role: string) => void;
  onUpdateStatus: (eventId: string, teamMemberId: string, status: "accepted" | "declined") => void;
  getAssignmentCounts: (event: ScheduledEvent) => AssignmentCounts;
}
