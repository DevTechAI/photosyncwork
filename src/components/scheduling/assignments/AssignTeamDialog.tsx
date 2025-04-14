
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScheduledEvent, TeamMember } from "../types";
import { AssignmentCounts } from "./types";

interface AssignTeamDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  currentEvent: ScheduledEvent | null;
  selectedTeamMember: string;
  setSelectedTeamMember: (id: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  teamMembers: TeamMember[];
  getAssignmentCounts: (event: ScheduledEvent) => AssignmentCounts;
  handleAssign: () => void;
}

export function AssignTeamDialog({
  showDialog,
  setShowDialog,
  currentEvent,
  selectedTeamMember,
  setSelectedTeamMember,
  selectedRole,
  setSelectedRole,
  teamMembers,
  getAssignmentCounts,
  handleAssign
}: AssignTeamDialogProps) {
  // Filter available team members for the role
  const getAvailableTeamMembers = (role: string, eventDate: string) => {
    return teamMembers.filter(member => {
      // Check if member's role matches
      const roleMatches = member.role === role;
      
      // Check if member is available on the event date
      const isAvailable = !member.availability[eventDate] || 
                          member.availability[eventDate] === "available";
      
      // Check if member is not already assigned to this event
      const isNotAssigned = !currentEvent?.assignments.some(
        assignment => assignment.teamMemberId === member.id
      );
      
      return roleMatches && isAvailable && isNotAssigned;
    });
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Team Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">{currentEvent?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {currentEvent?.date} at {currentEvent?.location}
            </p>
            
            {currentEvent && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-sm font-medium">Required Team:</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {currentEvent.photographersCount} Photographers
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {currentEvent.videographersCount} Videographers
                  </span>
                </div>
                
                {currentEvent && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Current Assignments:</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {getAssignmentCounts(currentEvent).totalPhotographers}/{currentEvent.photographersCount} Photographers
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {getAssignmentCounts(currentEvent).totalVideographers}/{currentEvent.videographersCount} Videographers
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photographer">Photographer</SelectItem>
                <SelectItem value="videographer">Videographer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-member">Select Team Member</Label>
            <Select
              value={selectedTeamMember}
              onValueChange={setSelectedTeamMember}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {currentEvent && getAvailableTeamMembers(selectedRole, currentEvent.date).length > 0 ? (
                  getAvailableTeamMembers(selectedRole, currentEvent.date).map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-available-members" disabled>
                    No available team members for this role
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign}>Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
