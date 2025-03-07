
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { TimeLoggingForm } from "../shared/TimeLoggingForm";
import { TimeLogDisplay } from "../shared/TimeLogDisplay";

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
  const handleLogTime = (teamMemberId: string, hours: number) => {
    onLogTime(teamMemberId, hours);
  };
  
  return (
    <div className="space-y-6">
      <TimeLoggingForm 
        event={event} 
        teamMembers={teamMembers} 
        onLogTime={handleLogTime} 
        role="editor" // Filter for editors in post-production
      />
      
      <TimeLogDisplay 
        event={event} 
        teamMembers={teamMembers} 
        roleFilter="editor" // Show only editors' time logs
      />
    </div>
  );
}
