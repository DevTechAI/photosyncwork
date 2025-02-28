
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Send } from "lucide-react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";

interface TeamAssignmentTabProps {
  selectedEvent: ScheduledEvent;
  teamMembers: TeamMember[];
  assignedTeamMembers: Array<{ teamMember?: TeamMember } & any>;
  availablePhotographers: TeamMember[];
  availableVideographers: TeamMember[];
  loading: boolean;
  handleAssignTeamMember: (teamMemberId: string, role: "photographer" | "videographer") => void;
  handleMoveToProduction: () => void;
}

export function TeamAssignmentTab({ 
  selectedEvent,
  teamMembers,
  assignedTeamMembers,
  availablePhotographers,
  availableVideographers,
  loading,
  handleAssignTeamMember,
  handleMoveToProduction
}: TeamAssignmentTabProps) {
  return (
    <>
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Assigned Team Members</h2>
        {assignedTeamMembers.length > 0 ? (
          <div className="space-y-3">
            {assignedTeamMembers.map((assignment, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-3 border rounded-md"
              >
                <div>
                  <p className="font-medium">{assignment.teamMember?.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{assignment.teamMember?.role}</p>
                  {assignment.teamMember?.isFreelancer && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                      Freelancer
                    </span>
                  )}
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    assignment.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    assignment.status === 'declined' ? 'bg-red-100 text-red-800' :
                    assignment.status === 'reassigned' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No team members assigned yet</p>
        )}
      </Card>
      
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Assign Team Members</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Photographers ({assignedTeamMembers.filter(a => a.teamMember?.role === "photographer").length} / {selectedEvent.photographersCount})</h3>
            {availablePhotographers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availablePhotographers.map(photographer => (
                  <div 
                    key={photographer.id} 
                    className="p-3 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{photographer.name}</p>
                      <p className="text-xs text-muted-foreground">{photographer.phone}</p>
                      {photographer.isFreelancer && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Freelancer
                        </span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleAssignTeamMember(photographer.id, "photographer")}
                      disabled={loading}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Assign
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No more available photographers</p>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Videographers ({assignedTeamMembers.filter(a => a.teamMember?.role === "videographer").length} / {selectedEvent.videographersCount})</h3>
            {availableVideographers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableVideographers.map(videographer => (
                  <div 
                    key={videographer.id} 
                    className="p-3 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{videographer.name}</p>
                      <p className="text-xs text-muted-foreground">{videographer.phone}</p>
                      {videographer.isFreelancer && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Freelancer
                        </span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleAssignTeamMember(videographer.id, "videographer")}
                      disabled={loading}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Assign
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No more available videographers</p>
            )}
          </div>
        </div>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleMoveToProduction}
          disabled={
            assignedTeamMembers.filter(a => a.teamMember?.role === "photographer").length < selectedEvent.photographersCount ||
            assignedTeamMembers.filter(a => a.teamMember?.role === "videographer").length < selectedEvent.videographersCount
          }
        >
          <Send className="h-4 w-4 mr-2" />
          Move to Production
        </Button>
      </div>
    </>
  );
}
