
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface TimeTrackingTabProps {
  events: ScheduledEvent[];
  teamMembers: TeamMember[];
  onLogTime: (eventId: string, teamMemberId: string, hours: number) => void;
}

export function TimeTrackingTab({ events, teamMembers, onLogTime }: TimeTrackingTabProps) {
  // Filter events to only show production events
  const productionEvents = events.filter(event => event.stage === "production");
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Production Time Tracking</h3>
      
      {productionEvents.length > 0 ? (
        productionEvents.map(event => (
          <div key={event.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{event.name}</h4>
              <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                {new Date(event.date).toLocaleDateString()}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-medium">Team Hours Logged</h5>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const teamMemberId = event.assignments[0]?.teamMemberId || teamMembers[0].id;
                    onLogTime(event.id, teamMemberId, 1);
                  }}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Log Hours
                </Button>
              </div>
              
              {event.timeTracking && event.timeTracking.length > 0 ? (
                <div className="space-y-2">
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
          </div>
        ))
      ) : (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">No production events found</p>
        </div>
      )}
    </div>
  );
}
