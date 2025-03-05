
import { TeamMember, ScheduledEvent } from "@/components/scheduling/types";

// Mock function to simulate sending assignment notification
export const sendAssignmentNotification = (teamMember: TeamMember, event: ScheduledEvent) => {
  console.log(`Sending notification to ${teamMember.name} for event ${event.name}`);
  // In a real application, you would use an actual notification service
};
