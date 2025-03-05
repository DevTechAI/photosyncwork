
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { AssignedTeamList } from "@/components/scheduling/assignments/AssignedTeamList";
import { TeamMemberList } from "./TeamMemberList";

interface TeamAssignmentTabProps {
  selectedEvent: ScheduledEvent;
  teamMembers: TeamMember[];
  assignedTeamMembers: Array<{ teamMember?: TeamMember } & any>;
  availablePhotographers: TeamMember[];
  availableVideographers: TeamMember[];
  loading: boolean;
  handleAssignTeamMember: (teamMemberId: string, role: "photographer" | "videographer") => void;
  handleMoveToProduction: () => void;
  handleUpdateAssignmentStatus?: (eventId: string, teamMemberId: string, status: "accepted" | "declined") => void;
}

export function TeamAssignmentTab({ 
  selectedEvent,
  teamMembers,
  assignedTeamMembers,
  availablePhotographers,
  availableVideographers,
  loading,
  handleAssignTeamMember,
  handleMoveToProduction,
  handleUpdateAssignmentStatus
}: TeamAssignmentTabProps) {
  const photographersAssigned = assignedTeamMembers.filter(a => a.teamMember?.role === "photographer").length;
  const videographersAssigned = assignedTeamMembers.filter(a => a.teamMember?.role === "videographer").length;
  
  console.log("TeamAssignmentTab - Available photographers:", availablePhotographers);
  console.log("TeamAssignmentTab - Available videographers:", availableVideographers);
  console.log("TeamAssignmentTab - Assigned team members:", assignedTeamMembers);
  
  // Function to handle accepting/declining assignments with better error handling
  const onUpdateStatus = (eventId: string, teamMemberId: string, status: "accepted" | "declined") => {
    console.log(`Updating assignment status: ${eventId}, ${teamMemberId}, ${status}`);
    if (handleUpdateAssignmentStatus) {
      handleUpdateAssignmentStatus(eventId, teamMemberId, status);
    } else {
      console.error("handleUpdateAssignmentStatus is not defined");
    }
  };
  
  // Function to handle assigning a team member
  const onAssignTeamMember = (teamMemberId: string, role: "photographer" | "videographer") => {
    console.log(`Assigning team member ${teamMemberId} as ${role}`);
    handleAssignTeamMember(teamMemberId, role);
  };
  
  return (
    <>
      <AssignedTeamList 
        event={selectedEvent}
        teamMembers={teamMembers}
        onUpdateStatus={onUpdateStatus}
      />
      
      <Card className="p-6 mt-4">
        <h2 className="text-lg font-medium mb-4">Assign Team Members</h2>
        
        <div className="space-y-6">
          <TeamMemberList
            title="Photographers"
            members={availablePhotographers}
            assignedCount={photographersAssigned}
            requiredCount={selectedEvent.photographersCount}
            onAssign={(teamMemberId) => onAssignTeamMember(teamMemberId, "photographer")}
            loading={loading}
          />
          
          <TeamMemberList
            title="Videographers"
            members={availableVideographers}
            assignedCount={videographersAssigned}
            requiredCount={selectedEvent.videographersCount}
            onAssign={(teamMemberId) => onAssignTeamMember(teamMemberId, "videographer")}
            loading={loading}
          />
        </div>
      </Card>
      
      <div className="flex justify-end mt-4">
        <Button 
          onClick={handleMoveToProduction}
          disabled={
            photographersAssigned < selectedEvent.photographersCount ||
            videographersAssigned < selectedEvent.videographersCount
          }
        >
          <Send className="h-4 w-4 mr-2" />
          Move to Production
        </Button>
      </div>
    </>
  );
}
