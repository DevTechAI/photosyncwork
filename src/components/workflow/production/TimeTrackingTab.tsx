
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Clock, UserCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TimeTrackingTabProps {
  event: ScheduledEvent;
  teamMembers: TeamMember[];
  onLogTime: (teamMemberId: string, hours: number) => void;
}

export function TimeTrackingTab({ 
  event, 
  teamMembers, 
  onLogTime 
}: TimeTrackingTabProps) {
  const { toast } = useToast();
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [hoursLogged, setHoursLogged] = useState("1");
  
  // Filter team members who are assigned to this event
  const assignedTeamMembers = event.assignments
    ? event.assignments
        .map(assignment => {
          const teamMember = teamMembers.find(tm => tm.id === assignment.teamMemberId);
          return teamMember 
            ? { 
                ...teamMember, 
                assignmentStatus: assignment.status 
              } 
            : null;
        })
        .filter(tm => tm !== null) as (TeamMember & { assignmentStatus: string })[]
    : [];
  
  // Get total hours logged for each team member
  const getTeamMemberHours = (teamMemberId: string) => {
    if (!event.timeTracking) return 0;
    
    return event.timeTracking
      .filter(entry => entry.teamMemberId === teamMemberId)
      .reduce((total, entry) => total + entry.hoursLogged, 0);
  };
  
  const handleLogTime = () => {
    if (!selectedTeamMember) {
      toast({
        title: "Select Team Member",
        description: "Please select a team member to log time for",
        variant: "destructive",
      });
      return;
    }
    
    const hours = parseFloat(hoursLogged);
    if (isNaN(hours) || hours <= 0) {
      toast({
        title: "Invalid Hours",
        description: "Please enter a valid number of hours",
        variant: "destructive",
      });
      return;
    }
    
    onLogTime(selectedTeamMember, hours);
    
    // Reset form
    setHoursLogged("1");
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Log Time for {event.name}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="team-member">Team Member</Label>
            <Select
              value={selectedTeamMember}
              onValueChange={setSelectedTeamMember}
            >
              <SelectTrigger id="team-member">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {assignedTeamMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hours">Hours</Label>
            <Input
              id="hours"
              type="number"
              min="0.5"
              step="0.5"
              value={hoursLogged}
              onChange={(e) => setHoursLogged(e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={handleLogTime}
              className="w-full"
            >
              <Clock className="h-4 w-4 mr-2" />
              Log Time
            </Button>
          </div>
        </div>
      </Card>
      
      <h3 className="text-lg font-medium mt-6">Time Logged</h3>
      
      {assignedTeamMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedTeamMembers.map(member => {
            const totalHours = getTeamMemberHours(member.id);
            
            return (
              <Card key={member.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {totalHours} hrs
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <UserCheck className="h-4 w-4 mr-1" />
                  <span>Status: {member.assignmentStatus}</span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">
            No team members assigned to this event yet
          </p>
        </Card>
      )}
    </div>
  );
}
