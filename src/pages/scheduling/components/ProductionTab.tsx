
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";

interface ProductionTabProps {
  events: ScheduledEvent[];
  teamMembers: TeamMember[];
}

export function ProductionTab({ events, teamMembers }: ProductionTabProps) {
  const [productionTab, setProductionTab] = useState("tracking");

  return (
    <Tabs value={productionTab} onValueChange={setProductionTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="tracking">Time Tracking</TabsTrigger>
        <TabsTrigger value="notes">Production Notes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="tracking" className="space-y-4">
        <h3 className="font-medium text-lg">Production Time Tracking</h3>
        
        {events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{event.name}</h4>
                <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Team Hours Logged</h5>
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
      </TabsContent>
      
      <TabsContent value="notes" className="space-y-4">
        <h3 className="font-medium text-lg">Production Notes</h3>
        
        {events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{event.name}</h4>
                <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Client Inputs During Shoot</h5>
                <p className="text-sm text-muted-foreground">No client inputs recorded</p>
              </div>
              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Team Observations</h5>
                <p className="text-sm text-muted-foreground">No team observations recorded</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-muted-foreground">No production events found</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
