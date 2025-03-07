
import { Card } from "@/components/ui/card";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { UserCheck, Clock } from "lucide-react";

interface TimeLogDisplayProps {
  event: ScheduledEvent;
  teamMembers: TeamMember[];
  roleFilter?: string;
}

export function TimeLogDisplay({ 
  event, 
  teamMembers,
  roleFilter
}: TimeLogDisplayProps) {
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
        .filter(tm => tm !== null && (!roleFilter || tm.role === roleFilter)) as (TeamMember & { assignmentStatus: string })[]
    : [];
  
  // Get total hours logged for each team member
  const getTeamMemberHours = (teamMemberId: string) => {
    if (!event.timeTracking) return 0;
    
    return event.timeTracking
      .filter(entry => entry.teamMemberId === teamMemberId)
      .reduce((total, entry) => total + entry.hoursLogged, 0);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Time Logged</h3>
      
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
