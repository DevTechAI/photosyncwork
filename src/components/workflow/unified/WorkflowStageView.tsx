
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { EventAssignments } from "@/components/scheduling/assignments/EventAssignments";
import { TimeTrackingTab } from "@/components/workflow/production/TimeTrackingTab";
import { ProductionNotesTab } from "@/components/workflow/production/ProductionNotesTab";

interface WorkflowStageViewProps {
  stage: "pre-production" | "production" | "post-production";
  events: ScheduledEvent[];
  selectedEvent: ScheduledEvent | null;
  teamMembers: TeamMember[];
  onSelectEvent: (event: ScheduledEvent) => void;
  onUpdateEvent: (event: ScheduledEvent) => void;
  onMoveToNextStage: (eventId: string) => void;
  onAssignTeamMember: (eventId: string, teamMemberId: string, role: string) => void;
  onUpdateAssignmentStatus: (eventId: string, teamMemberId: string, status: "accepted" | "declined" | "pending") => void;
  onLogTime: (eventId: string, teamMemberId: string, hours: number) => void;
  getAssignmentCounts: (event: ScheduledEvent) => {
    acceptedPhotographers: number;
    acceptedVideographers: number;
    pendingPhotographers: number;
    pendingVideographers: number;
    totalPhotographers: number;
    totalVideographers: number;
  };
}

export function WorkflowStageView({
  stage,
  events,
  selectedEvent,
  teamMembers,
  onSelectEvent,
  onUpdateEvent,
  onMoveToNextStage,
  onAssignTeamMember,
  onUpdateAssignmentStatus,
  onLogTime,
  getAssignmentCounts
}: WorkflowStageViewProps) {
  const [activeTab, setActiveTab] = useState("details");

  const getStageTitle = (stage: string) => {
    switch (stage) {
      case "pre-production": return "Pre-Production";
      case "production": return "Production";
      case "post-production": return "Post-Production";
      default: return stage;
    }
  };

  const getNextStageLabel = (stage: string) => {
    switch (stage) {
      case "pre-production": return "Start Production";
      case "production": return "Move to Post-Production";
      case "post-production": return "Mark Complete";
      default: return "Next Stage";
    }
  };

  const EventListItem = ({ event }: { event: ScheduledEvent }) => (
    <Card 
      className={`cursor-pointer transition-all ${
        selectedEvent?.id === event.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
      }`}
      onClick={() => onSelectEvent(event)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium">{event.name}</h4>
          <div className="flex gap-2">
            <Badge variant="outline">
              {event.assignments.length} assigned
            </Badge>
          </div>
        </div>
        
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            {format(parseISO(event.date), 'MMM dd, yyyy')}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            {event.location}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3" />
            {event.clientName}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handleUpdateNotes = (eventId: string, notes: string) => {
    if (selectedEvent && selectedEvent.id === eventId) {
      const updatedEvent = { ...selectedEvent, notes };
      onUpdateEvent(updatedEvent);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Event List */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {getStageTitle(stage)} Events
              <Badge variant="secondary">{events.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.map(event => (
                <EventListItem key={event.id} event={event} />
              ))}
              {events.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No events in {stage.replace('-', ' ')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Details */}
      <div className="lg:col-span-3">
        {selectedEvent ? (
          <div className="space-y-4">
            {/* Event Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedEvent.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.clientName} • {format(parseISO(selectedEvent.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Button 
                    onClick={() => onMoveToNextStage(selectedEvent.id)}
                    className="flex items-center gap-2"
                  >
                    {getNextStageLabel(stage)}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Stage-specific Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                {(stage === "production" || stage === "post-production") && (
                  <TabsTrigger value="time">Time Tracking</TabsTrigger>
                )}
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                        <p>{selectedEvent.location}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Time</h4>
                        <p>{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Team Required</h4>
                        <p>{selectedEvent.photographersCount} Photographers, {selectedEvent.videographersCount} Videographers</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Contact</h4>
                        <p>{selectedEvent.clientPhone}</p>
                      </div>
                    </div>
                    {selectedEvent.clientRequirements && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-muted-foreground">Requirements</h4>
                        <p className="mt-1">{selectedEvent.clientRequirements}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team">
                <EventAssignments 
                  events={[selectedEvent]}
                  teamMembers={teamMembers}
                  onAssign={onAssignTeamMember}
                  onUpdateStatus={onUpdateAssignmentStatus}
                  getAssignmentCounts={getAssignmentCounts}
                />
              </TabsContent>

              {(stage === "production" || stage === "post-production") && (
                <TabsContent value="time">
                  <TimeTrackingTab
                    selectedEvent={selectedEvent}
                    teamMembers={teamMembers}
                    onLogTime={onLogTime}
                  />
                </TabsContent>
              )}

              <TabsContent value="notes">
                <ProductionNotesTab
                  selectedEvent={selectedEvent}
                  onUpdateNotes={handleUpdateNotes}
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Card className="h-96 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select an Event</h3>
              <p className="text-muted-foreground">
                Choose an event from the list to view and manage its {stage.replace('-', ' ')} details
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
