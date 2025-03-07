
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { TimeTrackingTab as SharedTimeTrackingTab } from "../shared/TimeTrackingTab";

interface PostProductionTimeTrackingTabProps {
  event: ScheduledEvent;
  teamMembers: TeamMember[];
  onLogTime: (teamMemberId: string, hours: number) => void;
}

export function PostProductionTimeTrackingTab({ 
  event, 
  teamMembers, 
  onLogTime 
}: PostProductionTimeTrackingTabProps) {
  return (
    <SharedTimeTrackingTab
      event={event}
      teamMembers={teamMembers}
      onLogTime={onLogTime}
      roleFilter="editor" // Filter for editors in post-production
    />
  );
}
