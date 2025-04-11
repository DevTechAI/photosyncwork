
import { Button } from "@/components/ui/button";
import { ScheduledEvent, TeamMember } from "../types";
import { Check, X, RotateCcw, UserCheck } from "lucide-react";

interface AssignedTeamListProps {
  event: ScheduledEvent;
  teamMembers: TeamMember[];
  onUpdateStatus: (eventId: string, teamMemberId: string, status: "accepted" | "declined" | "pending") => void;
  showRevertOption?: boolean;
}

export function AssignedTeamList({ 
  event, 
  teamMembers, 
  onUpdateStatus,
  showRevertOption = false
}: AssignedTeamListProps) {
  return (
    <div className="mt-4 pt-4 border-t">
      <h5 className="text-sm font-medium mb-2">Assigned Team Members</h5>
      <div className="space-y-2">
        {event.assignments.length > 0 ? (
          event.assignments.map((assignment, index) => {
            const member = teamMembers.find(tm => tm.id === assignment.teamMemberId);
            const status = assignment.status || 'pending'; // Default to pending if status is undefined
            
            return (
              <div key={index} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{member?.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">({member?.role})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded text-xs ${
                    status === 'accepted' ? 'bg-green-100 text-green-800' : 
                    status === 'declined' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {status}
                  </div>
                  
                  {status === 'pending' && (
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
                  
                  {/* Revert option for admin - Available for accepted or declined assignments */}
                  {showRevertOption && status !== 'pending' && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Revert to pending status"
                      onClick={() => onUpdateStatus(event.id, assignment.teamMemberId, "pending")}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Revert
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-muted-foreground">No team members assigned yet</div>
        )}
      </div>
    </div>
  );
}
