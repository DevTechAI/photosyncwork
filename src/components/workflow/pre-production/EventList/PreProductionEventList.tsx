import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { ScheduledEvent } from "@/components/scheduling/types";

interface PreProductionEventListProps {
  events: ScheduledEvent[];
  selectedEvent: ScheduledEvent | null;
  setSelectedEvent: (event: ScheduledEvent) => void;
}

export function PreProductionEventList({ 
  events, 
  selectedEvent, 
  setSelectedEvent 
}: PreProductionEventListProps) {
  return (
    <div className="lg:col-span-1 space-y-4">
      <h2 className="text-lg font-medium">Upcoming Events</h2>
      
      {events.length > 0 ? (
        events.map(event => (
          <Card
            key={event.id}
            className={`p-4 cursor-pointer hover:border-primary transition-colors ${
              selectedEvent?.id === event.id ? "border-primary" : ""
            }`}
            onClick={() => setSelectedEvent(event)}
          >
            <h3 className="font-medium">{event.name}</h3>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
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
            
            {event.estimateId && (
              <div className="mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-sm inline-block">
                From Estimate #{event.estimateId.substring(0, 8)}
              </div>
            )}
            
            {event.estimatePackage && (
              <div className="mt-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-sm inline-block">
                {event.estimatePackage}
              </div>
            )}
            
            <div className="mt-2">
              <span className="text-xs font-medium">
                Team Assigned: {event.assignments.length} / {event.photographersCount + event.videographersCount}
              </span>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">No upcoming events in pre-production</p>
        </div>
      )}
    </div>
  );
}
