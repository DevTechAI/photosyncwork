
import { Card } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import { ScheduledEvent } from "@/components/scheduling/types";

interface PostProductionEventListProps {
  events: ScheduledEvent[];
  selectedEvent: ScheduledEvent | null;
  setSelectedEvent: (event: ScheduledEvent) => void;
}

export function PostProductionEventList({ 
  events, 
  selectedEvent, 
  setSelectedEvent 
}: PostProductionEventListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Post-Production Events</h2>
      
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
                <Users className="h-4 w-4" />
                <span>
                  {event.photographersCount} Photographer{event.photographersCount !== 1 ? "s" : ""}, 
                  {event.videographersCount} Videographer{event.videographersCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            
            {event.dataCopied ? (
              <div className="mt-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-sm inline-block">
                Data Copied
              </div>
            ) : (
              <div className="mt-2 text-xs bg-red-50 text-red-700 px-2 py-1 rounded-sm inline-block">
                Data Not Copied
              </div>
            )}
            
            {event.deliverables && (
              <div className="mt-2">
                <div className="text-xs space-x-1">
                  {event.deliverables.filter(d => d.status === "completed").length} / {event.deliverables.length} deliverables completed
                </div>
              </div>
            )}
          </Card>
        ))
      ) : (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">No events in post-production</p>
        </div>
      )}
    </div>
  );
}
