
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";

interface PostProductionTabProps {
  events: ScheduledEvent[];
  teamMembers: TeamMember[];
}

export function PostProductionTab({ events, teamMembers }: PostProductionTabProps) {
  const [postProductionTab, setPostProductionTab] = useState("deliverables");

  return (
    <Tabs value={postProductionTab} onValueChange={setPostProductionTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
        <TabsTrigger value="revisions">Revisions</TabsTrigger>
      </TabsList>
      
      <TabsContent value="deliverables" className="space-y-4">
        <h3 className="font-medium text-lg">Deliverables Tracking</h3>
        
        {events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{event.name}</h4>
                <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Deliverables</h5>
                {event.deliverables && event.deliverables.length > 0 ? (
                  <div className="space-y-2">
                    {event.deliverables.map((deliverable, index) => {
                      const member = teamMembers.find(m => m.id === deliverable.assignedTo);
                      return (
                        <div key={index} className="p-3 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium capitalize">{deliverable.type}</p>
                              <p className="text-xs text-muted-foreground">
                                Assigned to: {member?.name || "Unassigned"}
                              </p>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs ${
                              deliverable.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              deliverable.status === 'revision-requested' ? 'bg-amber-100 text-amber-800' : 
                              deliverable.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {deliverable.status.split('-').join(' ')}
                            </div>
                          </div>
                          {deliverable.deliveryDate && (
                            <p className="text-xs mt-2">
                              Delivery date: {new Date(deliverable.deliveryDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No deliverables added yet</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-muted-foreground">No post-production events found</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="revisions" className="space-y-4">
        <h3 className="font-medium text-lg">Revision Requests</h3>
        
        {events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{event.name}</h4>
                <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
              {event.deliverables && event.deliverables.some(d => d.status === "revision-requested") ? (
                <div className="mt-4">
                  <h5 className="text-sm font-medium mb-2">Revision Requests</h5>
                  <div className="space-y-2">
                    {event.deliverables
                      .filter(d => d.status === "revision-requested")
                      .map((deliverable, index) => {
                        const member = teamMembers.find(m => m.id === deliverable.assignedTo);
                        return (
                          <div key={index} className="p-3 border rounded-md bg-amber-50">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium capitalize">{deliverable.type} - Revision Requested</p>
                                <p className="text-xs text-muted-foreground">
                                  Assigned to: {member?.name || "Unassigned"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">No revision requests for this event</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-muted-foreground">No post-production events found</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
