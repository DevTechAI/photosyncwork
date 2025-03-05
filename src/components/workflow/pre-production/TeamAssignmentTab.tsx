
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, RotateCcw } from "lucide-react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { AssignedTeamList } from "@/components/scheduling/assignments/AssignedTeamList";
import { TeamMemberList } from "./TeamMemberList";
import { canAssignTeamMember } from "@/utils/teamMemberValidationUtils";
import { useToast } from "@/components/ui/use-toast";

interface TeamAssignmentTabProps {
  selectedEvent: ScheduledEvent;
  teamMembers: TeamMember[];
  assignedTeamMembers: Array<{ teamMember?: TeamMember } & any>;
  availablePhotographers: TeamMember[];
  availableVideographers: TeamMember[];
  loading: boolean;
  handleAssignTeamMember: (teamMemberId: string, role: "photographer" | "videographer") => void;
  handleMoveToProduction: () => void;
  handleUpdateAssignmentStatus?: (eventId: string, teamMemberId: string, status: "accepted" | "declined" | "pending") => void;
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
  const { toast } = useToast();
  const photographersAssigned = assignedTeamMembers.filter(a => a.teamMember?.role === "photographer").length;
  const videographersAssigned = assignedTeamMembers.filter(a => a.teamMember?.role === "videographer").length;
  
  console.log("TeamAssignmentTab - Available photographers:", availablePhotographers);
  console.log("TeamAssignmentTab - Available videographers:", availableVideographers);
  console.log("TeamAssignmentTab - Assigned team members:", assignedTeamMembers);
  
  // Function to handle accepting/declining assignments with validation
  const onUpdateStatus = (eventId: string, teamMemberId: string, status: "accepted" | "declined" | "pending") => {
    console.log(`Updating assignment status: ${eventId}, ${teamMemberId}, ${status}`);
    if (handleUpdateAssignmentStatus) {
      handleUpdateAssignmentStatus(eventId, teamMemberId, status);
    } else {
      console.error("handleUpdateAssignmentStatus is not defined");
    }
  };
  
  // Function to handle assigning a team member with validation
  const onAssignTeamMember = (teamMemberId: string, role: "photographer" | "videographer") => {
    console.log(`Attempting to assign team member ${teamMemberId} as ${role}`);
    
    // Validate that we haven't reached the maximum number of team members for this role
    if (!canAssignTeamMember(selectedEvent, role)) {
      toast({
        title: "Cannot assign team member",
        description: `Maximum number of ${role}s (${role === "photographer" ? selectedEvent.photographersCount : selectedEvent.videographersCount}) has been reached.`,
        variant: "destructive"
      });
      return;
    }
    
    // If validation passes, proceed with assignment
    handleAssignTeamMember(teamMemberId, role);
  };
  
  return (
    <>
      <AssignedTeamList 
        event={selectedEvent}
        teamMembers={teamMembers}
        onUpdateStatus={onUpdateStatus}
        showRevertOption={true} // Pass the option to show revert button
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
