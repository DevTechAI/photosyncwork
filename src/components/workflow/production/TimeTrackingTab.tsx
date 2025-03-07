
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { TimeLoggingForm } from "../shared/TimeLoggingForm";
import { TimeLogDisplay } from "../shared/TimeLogDisplay";

interface TimeTrackingTabProps {
  selectedEvent: ScheduledEvent;
  teamMembers: TeamMember[];
  onLogTime: (eventId: string, teamMemberId: string, hours: number) => void;
}

export function TimeTrackingTab({ 
  selectedEvent, 
  teamMembers, 
  onLogTime 
}: TimeTrackingTabProps) {
  const handleLogTime = (teamMemberId: string, hours: number) => {
    onLogTime(selectedEvent.id, teamMemberId, hours);
  };
  
  return (
    <div className="space-y-6">
      <TimeLoggingForm 
        event={selectedEvent} 
        teamMembers={teamMembers} 
        onLogTime={handleLogTime} 
      />
      
      <TimeLogDisplay 
        event={selectedEvent} 
        teamMembers={teamMembers} 
      />
    </div>
  );
}
