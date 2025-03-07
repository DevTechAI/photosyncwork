
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { TimeLoggingForm } from "./TimeLoggingForm";
import { TimeLogDisplay } from "./TimeLogDisplay";

interface TimeTrackingTabProps {
  event: ScheduledEvent;
  teamMembers: TeamMember[];
  onLogTime: (teamMemberId: string, hours: number) => void;
  roleFilter?: string; // Optional filter by role
}

export function TimeTrackingTab({ 
  event, 
  teamMembers, 
  onLogTime,
  roleFilter
}: TimeTrackingTabProps) {
  const handleLogTime = (teamMemberId: string, hours: number) => {
    onLogTime(teamMemberId, hours);
  };
  
  return (
    <div className="space-y-6">
      <TimeLoggingForm 
        event={event} 
        teamMembers={teamMembers} 
        onLogTime={handleLogTime} 
        role={roleFilter}
      />
      
      <TimeLogDisplay 
        event={event} 
        teamMembers={teamMembers} 
        roleFilter={roleFilter}
      />
    </div>
  );
}
