
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { ScheduledEvent } from "@/components/scheduling/types";

interface ProductionSidebarProps {
  events: ScheduledEvent[];
  selectedEvent: ScheduledEvent | null;
  onSelectEvent: (event: ScheduledEvent) => void;
  onMoveToPostProduction: (eventId: string) => void;
}

export function ProductionSidebar({ 
  events, 
  selectedEvent, 
  onSelectEvent,
  onMoveToPostProduction
}: ProductionSidebarProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Production Events</h3>
      
      {events.length > 0 ? (
        <div className="space-y-3">
          {events.map(event => (
            <Card
              key={event.id}
              className={`p-4 cursor-pointer hover:border-primary transition-colors ${
                selectedEvent?.id === event.id ? "border-primary" : ""
              }`}
              onClick={() => onSelectEvent(event)}
            >
              <h4 className="font-medium">{event.name}</h4>
              <div className="text-sm text-muted-foreground mt-1">
                Client: {event.clientName}
              </div>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {event.photographersCount} Photographer{event.photographersCount !== 1 ? "s" : ""}, 
                    {event.videographersCount} Videographer{event.videographersCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              
              {selectedEvent?.id === event.id && (
                <div className="mt-3">
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveToPostProduction(event.id);
                    }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Move to Post-Production
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">No events in production</p>
        </div>
      )}
    </div>
  );
}
