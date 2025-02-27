
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { ScheduledEvent, TeamMember } from "./types";

interface EventAssignmentsProps {
  events: ScheduledEvent[];
  teamMembers: TeamMember[];
  onAssign: (eventId: string, teamMemberId: string, role: string) => void;
  onUpdateStatus: (eventId: string, teamMemberId: string, status: "accepted" | "declined") => void;
}

export function EventAssignments({
  events,
  teamMembers,
  onAssign,
  onUpdateStatus,
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

  const handleStatusUpdate = (eventId: string, teamMemberId: string, status: "accepted" | "declined") => {
    onUpdateStatus(eventId, teamMemberId, status);
    
    toast({
      title: `Assignment ${status}`,
      description: `The team member has ${status} the assignment`,
      variant: status === "accepted" ? "default" : "destructive",
    });
  };

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
    <div className="space-y-4">
      <h3 className="font-medium">Event Assignments</h3>

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="p-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">{event.name}</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.photographersCount} Photographers, {event.videographersCount} Videographers</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleOpenAssignDialog(event)}>
                Assign Team
              </Button>
            </div>

            {event.assignments.length > 0 && (
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
                                className="h-6 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleStatusUpdate(event.id, assignment.teamMemberId, "accepted")}
                              >
                                Accept
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-6 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleStatusUpdate(event.id, assignment.teamMemberId, "declined")}
                              >
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
            )}
          </Card>
        ))}
      </div>

      {/* Assign Team Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
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
                    <SelectItem value="none" disabled>
                      No available team members for this role
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
