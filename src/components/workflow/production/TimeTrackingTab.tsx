
import { useState } from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TimeLogInputProps {
  event: ScheduledEvent;
  teamMembers: TeamMember[];
  onLogTime: (eventId: string, teamMemberId: string, hours: number) => void;
  onCancel: () => void;
}

function TimeLogInput({ event, teamMembers, onLogTime, onCancel }: TimeLogInputProps) {
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState<string>(
    event.assignments[0]?.teamMemberId || teamMembers[0]?.id || ""
  );
  const [hours, setHours] = useState<number>(1);

  const handleLogTime = () => {
    if (selectedTeamMemberId && hours > 0) {
      onLogTime(event.id, selectedTeamMemberId, hours);
      onCancel();
    }
  };

  // Get team members assigned to this event or available
  const availableTeamMembers = event.assignments.length > 0
    ? teamMembers.filter(m => event.assignments.some(a => a.teamMemberId === m.id))
    : teamMembers;

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-md">
      <div className="space-y-2">
        <Label htmlFor="team-member">Team Member</Label>
        <select
          id="team-member"
          className="w-full p-2 border rounded"
          value={selectedTeamMemberId}
          onChange={e => setSelectedTeamMemberId(e.target.value)}
        >
          {availableTeamMembers.map(member => (
            <option key={member.id} value={member.id}>
              {member.name} ({member.role})
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hours">Hours</Label>
        <Input
          id="hours"
          type="number"
          min="0.5"
          step="0.5"
          value={hours}
          onChange={e => setHours(Number(e.target.value))}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleLogTime}>
          <Clock className="h-4 w-4 mr-2" />
          Log Time
        </Button>
      </div>
    </div>
  );
}

interface TimeTrackingTabProps {
  events: ScheduledEvent[];
  teamMembers: TeamMember[];
  onLogTime: (eventId: string, teamMemberId: string, hours: number) => void;
}

export function TimeTrackingTab({ events, teamMembers, onLogTime }: TimeTrackingTabProps) {
  // Filter events to only show production events
  const productionEvents = events.filter(event => event.stage === "production");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Production Time Tracking</h3>
      
      {productionEvents.length > 0 ? (
        productionEvents.map(event => (
          <Card key={event.id} className="p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{event.name}</h4>
              <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                {new Date(event.date).toLocaleDateString()}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-medium">Team Hours Logged</h5>
                {selectedEventId !== event.id && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedEventId(event.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Log Hours
                  </Button>
                )}
              </div>
              
              {selectedEventId === event.id && (
                <TimeLogInput 
                  event={event}
                  teamMembers={teamMembers}
                  onLogTime={onLogTime}
                  onCancel={() => setSelectedEventId(null)}
                />
              )}
              
              {event.timeTracking && event.timeTracking.length > 0 ? (
                <div className="space-y-2 mt-4">
                  {event.timeTracking.map((timeLog, index) => {
                    const member = teamMembers.find(m => m.id === timeLog.teamMemberId);
                    return (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">{member?.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground capitalize">{member?.role}</p>
                        </div>
                        <div className="text-sm font-medium">
                          {timeLog.hoursLogged} hours
                          <div className="text-xs text-muted-foreground">
                            {new Date(timeLog.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No time tracking data available</p>
              )}
            </div>
            
            <div className="mt-4">
              <h5 className="text-sm font-medium mb-2">Team Assignments</h5>
              {event.assignments.length > 0 ? (
                <div className="space-y-2">
                  {event.assignments.map((assignment, index) => {
                    const member = teamMembers.find(tm => tm.id === assignment.teamMemberId);
                    return (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">{member?.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground capitalize">{member?.role}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          assignment.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                          assignment.status === 'declined' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {assignment.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No team members assigned yet</p>
              )}
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">No production events found</p>
        </div>
      )}
    </div>
  );
}
