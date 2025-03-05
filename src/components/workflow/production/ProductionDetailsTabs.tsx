
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Card } from "@/components/ui/card";
import { ProductionNotesTab } from "./ProductionNotesTab";
import { TimeTrackingTab } from "./TimeTrackingTab";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, MapPin, Users, Package } from "lucide-react";

interface ProductionDetailsTabsProps {
  selectedEvent: ScheduledEvent | null;
  events: ScheduledEvent[];
  teamMembers: TeamMember[];
  activeTab: string;
  setActiveTab: (value: string) => void;
  onLogTime: (eventId: string, teamMemberId: string, hours: number) => void;
  onUpdateNotes: (eventId: string, notes: string) => void;
}

export function ProductionDetailsTabs({
  selectedEvent,
  events,
  teamMembers,
  activeTab,
  setActiveTab,
  onLogTime,
  onUpdateNotes
}: ProductionDetailsTabsProps) {
  // If no event is selected, show a placeholder
  if (!selectedEvent) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Select an event to view details</p>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full">
        <TabsTrigger value="details">Event Details</TabsTrigger>
        <TabsTrigger value="tracking">Time Tracking</TabsTrigger>
        <TabsTrigger value="notes">Production Notes</TabsTrigger>
        <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
      </TabsList>
      
      {/* Event Details Tab */}
      <TabsContent value="details">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Event Information</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium">Date & Time</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(selectedEvent.date).toLocaleDateString()} ({selectedEvent.startTime} - {selectedEvent.endTime})</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Location</h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{selectedEvent.location}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Team Requirements</h3>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {selectedEvent.photographersCount} Photographer{selectedEvent.photographersCount !== 1 ? 's' : ''}, 
                  {selectedEvent.videographersCount} Videographer{selectedEvent.videographersCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Client</h3>
              <div className="mt-1">
                <p>{selectedEvent.clientName}</p>
                <p className="text-sm text-muted-foreground">{selectedEvent.clientPhone}</p>
                {selectedEvent.clientEmail && (
                  <p className="text-sm text-muted-foreground">{selectedEvent.clientEmail}</p>
                )}
              </div>
            </div>
          </div>
          
          {selectedEvent.estimateId && (
            <div className="mt-4">
              <Badge variant="outline" className="mr-1">
                From Estimate #{selectedEvent.estimateId.substring(0, 8)}
              </Badge>
              {selectedEvent.estimatePackage && (
                <Badge variant="outline" className="bg-green-50">
                  {selectedEvent.estimatePackage}
                </Badge>
              )}
            </div>
          )}
          
          {/* Show assigned team members */}
          <div className="mt-6">
            <h3 className="text-sm font-medium">Assigned Team Members</h3>
            <div className="mt-2 space-y-2">
              {selectedEvent.assignments && selectedEvent.assignments.length > 0 ? (
                selectedEvent.assignments.map((assignment, index) => {
                  const teamMember = teamMembers.find(tm => tm.id === assignment.teamMemberId);
                  return (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{teamMember?.name || "Unknown Team Member"}</span>
                      </div>
                      {assignment.status === 'accepted' && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Check className="h-3 w-3 mr-1" /> Accepted
                        </Badge>
                      )}
                      {assignment.status === 'declined' && (
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          Declined
                        </Badge>
                      )}
                      {assignment.status === 'pending' && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          Pending
                        </Badge>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No team members assigned</p>
              )}
            </div>
          </div>
        </Card>
      </TabsContent>
      
      {/* Time Tracking Tab */}
      <TabsContent value="tracking">
        <TimeTrackingTab 
          event={selectedEvent}
          teamMembers={teamMembers}
          onLogTime={(teamMemberId, hours) => onLogTime(selectedEvent.id, teamMemberId, hours)}
        />
      </TabsContent>
      
      {/* Production Notes Tab */}
      <TabsContent value="notes">
        <ProductionNotesTab 
          event={selectedEvent}
          onUpdateNotes={(notes) => onUpdateNotes(selectedEvent.id, notes)}
        />
      </TabsContent>
      
      {/* Deliverables Tab */}
      <TabsContent value="deliverables">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">
            <Package className="h-5 w-5 inline-block mr-2" />
            Deliverables
          </h2>
          
          {selectedEvent.deliverables && selectedEvent.deliverables.length > 0 ? (
            <ul className="space-y-2 mt-4">
              {selectedEvent.deliverables.map((deliverable, index) => (
                <li key={index} className="flex items-start gap-2 p-3 border rounded-md">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <span className="font-medium">{deliverable.type}</span>
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs">
                      {deliverable.status}
                    </span>
                    {deliverable.deliveryDate && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Due: {new Date(deliverable.deliveryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center p-4 text-muted-foreground">
              No deliverables specified for this event
            </p>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
}
