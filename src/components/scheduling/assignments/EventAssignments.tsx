
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ScheduledEvent } from "../types";
import { EventAssignmentsProps } from "./types";
import { AssignmentCard } from "./AssignmentCard";
import { AssignTeamDialog } from "./AssignTeamDialog";

export function EventAssignments({
  events,
  teamMembers,
  onAssign,
  onUpdateStatus,
  getAssignmentCounts,
}: EventAssignmentsProps) {
  const { toast } = useToast();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<ScheduledEvent | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [selectedRole, setSelectedRole] = useState("photographer");

  const handleOpenAssignDialog = (event: ScheduledEvent) => {
    setCurrentEvent(event);
    setSelectedTeamMember("");
    setSelectedRole("photographer");
    setShowAssignDialog(true);
  };

  const handleAssign = () => {
    if (!currentEvent || !selectedTeamMember) {
      toast({
        title: "Selection required",
        description: "Please select a team member to assign",
        variant: "destructive",
      });
      return;
    }

    onAssign(currentEvent.id, selectedTeamMember, selectedRole);
    setShowAssignDialog(false);

    toast({
      title: "Team member assigned",
      description: `Notification will be sent to the team member`,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Event Assignments</h3>

      <div className="space-y-4">
        {events.map((event) => (
          <AssignmentCard
            key={event.id}
            event={event}
            teamMembers={teamMembers}
            counts={getAssignmentCounts(event)}
            onOpenAssignDialog={handleOpenAssignDialog}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>

      {/* Assign Team Dialog */}
      <AssignTeamDialog
        showDialog={showAssignDialog}
        setShowDialog={setShowAssignDialog}
        currentEvent={currentEvent}
        selectedTeamMember={selectedTeamMember}
        setSelectedTeamMember={setSelectedTeamMember}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        teamMembers={teamMembers}
        getAssignmentCounts={getAssignmentCounts}
        handleAssign={handleAssign}
      />
    </div>
  );
}
