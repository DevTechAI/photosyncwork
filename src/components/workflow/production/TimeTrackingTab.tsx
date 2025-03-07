
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { TimeTrackingTab as SharedTimeTrackingTab } from "../shared/TimeTrackingTab";

interface TimeTrackingTabProps {
  event: ScheduledEvent;
  teamMembers: TeamMember[];
  onLogTime: (teamMemberId: string, hours: number) => void;
}

export function TimeTrackingTab({ 
  event, 
  teamMembers, 
  onLogTime 
}: TimeTrackingTabProps) {
  return (
    <SharedTimeTrackingTab
      event={event}
      teamMembers={teamMembers}
      onLogTime={onLogTime}
    />
  );
}
