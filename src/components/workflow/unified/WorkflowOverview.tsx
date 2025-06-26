
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScheduledEvent } from "@/components/scheduling/types";
import { Calendar, MapPin, Users, Clock, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";

interface WorkflowOverviewProps {
  events: ScheduledEvent[];
  getEventsByStage: (stage: "pre-production" | "production" | "post-production" | "completed") => ScheduledEvent[];
  onSelectEvent: (event: ScheduledEvent) => void;
  onCreateEvent: () => void;
}

export function WorkflowOverview({ 
  events, 
  getEventsByStage, 
  onSelectEvent, 
  onCreateEvent 
}: WorkflowOverviewProps) {
  const preProductionEvents = getEventsByStage("pre-production");
  const productionEvents = getEventsByStage("production");
  const postProductionEvents = getEventsByStage("post-production");
  const completedEvents = getEventsByStage("completed");

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "pre-production": return "bg-blue-100 text-blue-800";
      case "production": return "bg-yellow-100 text-yellow-800";
      case "post-production": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const EventCard = ({ event }: { event: ScheduledEvent }) => (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelectEvent(event)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium">{event.name}</h4>
          <Badge className={getStageColor(event.stage)}>
            {event.stage.replace('-', ' ')}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
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
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            {event.startTime} - {event.endTime}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pre-Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {preProductionEvents.length}
            </div>
            <p className="text-xs text-muted-foreground">Events in planning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {productionEvents.length}
            </div>
            <p className="text-xs text-muted-foreground">Active shoots</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Post-Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {postProductionEvents.length}
            </div>
            <p className="text-xs text-muted-foreground">In editing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedEvents.length}
            </div>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Button size="sm" onClick={onCreateEvent}>
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {preProductionEvents.slice(0, 3).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
              {preProductionEvents.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No upcoming events
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Productions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productionEvents.slice(0, 3).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
              {productionEvents.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No active productions
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline View */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.slice(0, 5).map(event => (
              <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => onSelectEvent(event)}>
                <div className="flex-shrink-0">
                  <Badge className={getStageColor(event.stage)}>
                    {event.stage.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">{event.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {event.clientName} • {format(parseISO(event.date), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {event.assignments.length} team members
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No events found</p>
                <Button className="mt-4" onClick={onCreateEvent}>
                  Create Your First Event
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
