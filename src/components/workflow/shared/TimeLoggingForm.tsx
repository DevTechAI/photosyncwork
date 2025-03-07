
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
import { Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TimeLoggingFormProps {
  event: ScheduledEvent;
  teamMembers: TeamMember[];
  onLogTime: (teamMemberId: string, hours: number) => void;
  role?: string; // Optional filter by role
}

export function TimeLoggingForm({ 
  event, 
  teamMembers, 
  onLogTime,
  role
}: TimeLoggingFormProps) {
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
        .filter(tm => tm !== null && (!role || tm.role === role)) as (TeamMember & { assignmentStatus: string })[]
    : [];
  
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
    toast({
      title: "Time Logged",
      description: `Successfully logged ${hours} hours.`
    });
  };
  
  return (
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
  );
}
