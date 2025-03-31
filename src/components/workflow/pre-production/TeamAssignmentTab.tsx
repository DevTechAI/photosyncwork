
import { Button } from "@/components/ui/button";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Loader2, UserCheck, UserX } from "lucide-react";
import { AISchedulingSuggestions } from "@/components/ai/AISchedulingSuggestions";

interface TeamAssignmentTabProps {
  selectedEvent: ScheduledEvent;
  teamMembers: TeamMember[];
  assignedTeamMembers: any[];
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
  handleUpdateAssignmentStatus,
}: TeamAssignmentTabProps) {
  const [selectedRole, setSelectedRole] = useState<"photographer" | "videographer">("photographer");
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  
  // Calculate how many more team members are needed
  const photographersNeeded = selectedEvent.photographersCount - assignedTeamMembers.filter(a => 
    teamMembers.find(m => m.id === a.teamMemberId)?.role === "photographer" && a.status !== "declined"
  ).length;
  
  const videographersNeeded = selectedEvent.videographersCount - assignedTeamMembers.filter(a => 
    teamMembers.find(m => m.id === a.teamMemberId)?.role === "videographer" && a.status !== "declined"
  ).length;
  
  // Check if we can move to production
  const canMoveToProduction = photographersNeeded <= 0 && videographersNeeded <= 0;
  
  // Handle assignment
  const handleAssign = () => {
    if (selectedTeamMember) {
      handleAssignTeamMember(selectedTeamMember, selectedRole);
      setSelectedTeamMember("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Team Assignment</h3>
        
        {/* Team Requirements Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Photographers</h4>
              <Badge>{selectedEvent.photographersCount} required</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {photographersNeeded > 0 
                ? `${photographersNeeded} more needed` 
                : "All photographers assigned"}
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Videographers</h4>
              <Badge>{selectedEvent.videographersCount} required</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {videographersNeeded > 0 
                ? `${videographersNeeded} more needed` 
                : "All videographers assigned"}
            </p>
          </div>
        </div>
        
        {/* AI Scheduling Suggestions */}
        <AISchedulingSuggestions 
          event={selectedEvent}
          teamMembers={teamMembers}
          onAssign={handleAssignTeamMember}
          availablePhotographers={availablePhotographers}
          availableVideographers={availableVideographers}
        />
        
        {/* Manual Assignment Form */}
        <div className="p-4 border rounded-lg space-y-4">
          <h4 className="font-medium">Manual Assignment</h4>
          
          <div className="grid grid-cols-3 gap-4">
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as "photographer" | "videographer")}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photographer">Photographer</SelectItem>
                <SelectItem value="videographer">Videographer</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {selectedRole === "photographer" ? (
                  availablePhotographers.length > 0 ? (
                    availablePhotographers.map(photographer => (
                      <SelectItem key={photographer.id} value={photographer.id}>{photographer.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="none">No photographers available</SelectItem>
                  )
                ) : (
                  availableVideographers.length > 0 ? (
                    availableVideographers.map(videographer => (
                      <SelectItem key={videographer.id} value={videographer.id}>{videographer.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="none">No videographers available</SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            
            <Button onClick={handleAssign} disabled={!selectedTeamMember || loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Assign
            </Button>
          </div>
        </div>
        
        {/* Assigned Team Members */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedTeamMembers.length > 0 ? (
                assignedTeamMembers.map((assignment, index) => {
                  const teamMember = assignment.teamMember || { name: 'Unknown' };
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{teamMember.name}</TableCell>
                      <TableCell>{teamMember.role || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={assignment.status === "accepted" ? "default" : 
                                  assignment.status === "declined" ? "destructive" : "secondary"}
                        >
                          {assignment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {assignment.status === "pending" && handleUpdateAssignmentStatus && (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleUpdateAssignmentStatus(selectedEvent.id, assignment.teamMemberId, "accepted")}
                            >
                              <UserCheck className="h-4 w-4 mr-1" /> Accept
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleUpdateAssignmentStatus(selectedEvent.id, assignment.teamMemberId, "declined")}
                            >
                              <UserX className="h-4 w-4 mr-1" /> Decline
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No team members assigned yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Move to Production Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleMoveToProduction} 
            disabled={!canMoveToProduction || loading}
            className="mt-4"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Move to Production
          </Button>
        </div>
      </div>
    </div>
  );
}
