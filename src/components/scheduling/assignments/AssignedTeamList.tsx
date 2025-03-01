
import { Button } from "@/components/ui/button";
import { ScheduledEvent, TeamMember } from "../types";
import { Check, X } from "lucide-react";

interface AssignedTeamListProps {
  event: ScheduledEvent;
  teamMembers: TeamMember[];
  onUpdateStatus: (eventId: string, teamMemberId: string, status: "accepted" | "declined") => void;
}

export function AssignedTeamList({ event, teamMembers, onUpdateStatus }: AssignedTeamListProps) {
  return (
    <div className="mt-4 pt-4 border-t">
      <h5 className="text-sm font-medium mb-2">Assigned Team Members</h5>
      <div className="space-y-2">
        {event.assignments.map((assignment, index) => {
          const member = teamMembers.find(tm => tm.id === assignment.teamMemberId);
          return (
            <div key={index} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{member?.name}</span>
                <span className="text-xs text-muted-foreground capitalize">({member?.role})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded text-xs ${
                  assignment.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                  assignment.status === 'declined' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {assignment.status}
                </div>
                
                {assignment.status === 'pending' && (
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => onUpdateStatus(event.id, assignment.teamMemberId, "accepted")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onUpdateStatus(event.id, assignment.teamMemberId, "declined")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
