import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { EventAssignments } from "@/components/scheduling/assignments/EventAssignments";

interface PreProductionTabProps {
  events: ScheduledEvent[];
  teamMembers: TeamMember[];
  onAssignTeamMember: (eventId: string, teamMemberId: string, role: string) => void;
  onUpdateAssignmentStatus: (eventId: string, teamMemberId: string, status: "accepted" | "declined") => void;
  getAssignmentCounts: (event: ScheduledEvent) => {
    acceptedPhotographers: number;
    acceptedVideographers: number;
    pendingPhotographers: number;
    pendingVideographers: number;
    totalPhotographers: number;
    totalVideographers: number;
  };
}

export function PreProductionTab({
  events,
  teamMembers,
  onAssignTeamMember,
  onUpdateAssignmentStatus,
  getAssignmentCounts
}: PreProductionTabProps) {
  const [preProductionTab, setPreProductionTab] = useState("requirements");

  return (
    <Tabs value={preProductionTab} onValueChange={setPreProductionTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="requirements">Client Requirements</TabsTrigger>
        <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
      </TabsList>
      
      <TabsContent value="requirements" className="space-y-4">
        <h3 className="font-medium text-lg">Client Requirements & References</h3>
        
        {events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{event.name}</h4>
                <div className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <h5 className="text-sm font-medium">Client Details</h5>
                  <p className="text-sm">{event.clientName} • {event.clientPhone}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Requirements</h5>
                  <p className="text-sm">{event.clientRequirements || "No requirements added yet"}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium">References</h5>
                  {event.references && event.references.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {event.references.map((ref, index) => (
                        <div key={index} className="h-20 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">Reference {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No references added</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-muted-foreground">No pre-production events found</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="scheduling">
        <EventAssignments 
          events={events}
          teamMembers={teamMembers} 
          onAssign={onAssignTeamMember}
          onUpdateStatus={onUpdateAssignmentStatus}
          getAssignmentCounts={getAssignmentCounts}
        />
      </TabsContent>
    </Tabs>
  );
}
