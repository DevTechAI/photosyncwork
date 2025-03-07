
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCheck, Clock, CalendarClock } from "lucide-react";
import { TeamMember, ScheduledEvent, EventAssignment } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { AssignTeamDialog } from "@/components/scheduling/assignments/AssignTeamDialog";
import { getAssignmentCounts } from "@/utils/eventAssignmentUtils";
import { AssignedTeamList } from "@/components/scheduling/assignments/AssignedTeamList";
import { canAssignTeamMember } from "@/utils/teamMemberValidationUtils";

interface TeamAssignmentTabProps {
  selectedEvent: ScheduledEvent | null;
  teamMembers: TeamMember[];
  onAssignTeamMember: (eventId: string, teamMemberId: string, role: string) => Promise<void>;
  onUpdateAssignmentStatus: (eventId: string, teamMemberId: string, status: "accepted" | "declined" | "pending") => void;
  onLogTime: (eventId: string, teamMemberId: string, hours: number) => void;
}

export function TeamAssignmentTab({
  selectedEvent,
  teamMembers,
  onAssignTeamMember,
  onUpdateAssignmentStatus,
  onLogTime
}: TeamAssignmentTabProps) {
  const { toast } = useToast();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [selectedRole, setSelectedRole] = useState("photographer");
  const [timeToLog, setTimeToLog] = useState<string>("1");
  const [loading, setLoading] = useState(false);
  
  if (!selectedEvent) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Select an event to manage team assignments</p>
      </div>
    );
  }
  
  const handleOpenAssignDialog = () => {
    setSelectedTeamMember("");
    setSelectedRole("photographer");
    setShowAssignDialog(true);
  };
  
  const handleAssign = async () => {
    if (!selectedEvent || !selectedTeamMember) {
      toast({
        title: "Selection required",
        description: "Please select a team member to assign",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      await onAssignTeamMember(selectedEvent.id, selectedTeamMember, selectedRole);
      setShowAssignDialog(false);
    } catch (error) {
      console.error("Error assigning team member:", error);
      toast({
        title: "Error",
        description: "Failed to assign team member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogTime = () => {
    if (!selectedEvent) return;
    
    const hours = parseFloat(timeToLog);
    if (isNaN(hours) || hours <= 0) {
      toast({
        title: "Invalid time",
        description: "Please enter a valid number of hours",
        variant: "destructive",
      });
      return;
    }
    
    // Find assignments with accepted status for this event
    const acceptedAssignments = selectedEvent.assignments.filter(
      assignment => assignment.status === "accepted"
    );
    
    if (acceptedAssignments.length === 0) {
      toast({
        title: "No accepted assignments",
        description: "There are no team members who have accepted assignments for this event",
        variant: "destructive",
      });
      return;
    }
    
    // Log time for all accepted team members
    acceptedAssignments.forEach(assignment => {
      onLogTime(selectedEvent.id, assignment.teamMemberId, hours);
    });
    
    setTimeToLog("1");
    
    toast({
      title: "Time logged",
      description: `${hours} hours logged for all assigned team members`,
    });
  };
  
  // Get assignment counts for this event
  const assignmentCounts = getAssignmentCounts(selectedEvent, teamMembers);
  
  // Check if we can assign more team members
  const canAssignMorePhotographers = canAssignTeamMember(selectedEvent, "photographer");
  const canAssignMoreVideographers = canAssignTeamMember(selectedEvent, "videographer");
  const canAssignMore = canAssignMorePhotographers || canAssignMoreVideographers;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Team Assignments</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleOpenAssignDialog}
            disabled={!canAssignMore || loading}
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Assign Team Member
          </Button>
          <Button
            variant="outline"
            onClick={handleLogTime}
            disabled={!selectedEvent?.assignments.some(a => a.status === "accepted")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Log Time
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="font-medium mb-2">Required Team</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Photographers</span>
              <div className="flex items-center gap-1">
                <span className={
                  assignmentCounts.acceptedPhotographers >= selectedEvent.photographersCount
                    ? "text-green-600 font-medium"
                    : "text-amber-600 font-medium"
                }>
                  {assignmentCounts.acceptedPhotographers}
                </span>
                <span>/</span>
                <span>{selectedEvent.photographersCount}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Videographers</span>
              <div className="flex items-center gap-1">
                <span className={
                  assignmentCounts.acceptedVideographers >= selectedEvent.videographersCount
                    ? "text-green-600 font-medium"
                    : "text-amber-600 font-medium"
                }>
                  {assignmentCounts.acceptedVideographers}
                </span>
                <span>/</span>
                <span>{selectedEvent.videographersCount}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="font-medium mb-2">Event Details</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              <span>{selectedEvent.date}, {selectedEvent.startTime} - {selectedEvent.endTime}</span>
            </div>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Client:</strong> {selectedEvent.clientName}</p>
            {selectedEvent.guestCount && <p><strong>Guests:</strong> {selectedEvent.guestCount}</p>}
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 shadow-sm">
        <AssignedTeamList 
          event={selectedEvent}
          teamMembers={teamMembers}
          onUpdateStatus={onUpdateAssignmentStatus}
          showRevertOption={true}
        />
      </div>
      
      {/* Assign Team Dialog */}
      <AssignTeamDialog
        showDialog={showAssignDialog}
        setShowDialog={setShowAssignDialog}
        currentEvent={selectedEvent}
        selectedTeamMember={selectedTeamMember}
        setSelectedTeamMember={setSelectedTeamMember}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        teamMembers={teamMembers}
        getAssignmentCounts={() => assignmentCounts}
        handleAssign={handleAssign}
      />
    </div>
  );
}
