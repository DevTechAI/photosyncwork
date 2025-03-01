
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { ScheduledEvent, TeamMember } from "../types";
import { AssignmentCounts } from "./types";
import { AssignmentStatus } from "./AssignmentStatus";
import { TeamRequirementsBadges } from "./TeamRequirementsBadges";
import { AssignedTeamList } from "./AssignedTeamList";

interface AssignmentCardProps {
  event: ScheduledEvent;
  teamMembers: TeamMember[];
  counts: AssignmentCounts;
  onOpenAssignDialog: (event: ScheduledEvent) => void;
  onUpdateStatus: (eventId: string, teamMemberId: string, status: "accepted" | "declined") => void;
}

export function AssignmentCard({ 
  event, 
  teamMembers, 
  counts, 
  onOpenAssignDialog, 
  onUpdateStatus 
}: AssignmentCardProps) {
  const photographersMatch = counts.totalPhotographers === event.photographersCount;
  const videographersMatch = counts.totalVideographers === event.videographersCount;
  
  return (
    <Card key={event.id} className="p-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{event.name}</h4>
            <AssignmentStatus 
              counts={counts} 
              photographersCount={event.photographersCount} 
              videographersCount={event.videographersCount}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
          <TeamRequirementsBadges 
            totalPhotographers={counts.totalPhotographers}
            totalVideographers={counts.totalVideographers}
            requiredPhotographers={event.photographersCount}
            requiredVideographers={event.videographersCount}
          />
        </div>
        <Button 
          onClick={() => onOpenAssignDialog(event)}
          disabled={photographersMatch && videographersMatch}
        >
          Assign Team
        </Button>
      </div>

      {event.assignments.length > 0 && (
        <AssignedTeamList 
          event={event}
          teamMembers={teamMembers}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </Card>
  );
}
