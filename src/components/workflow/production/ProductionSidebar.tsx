
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
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
  // Filter to only show production events
  const productionEvents = events.filter(event => event.stage === "production");
  
  const handleMoveToPostProduction = (event: ScheduledEvent) => {
    // Only allow moving if there's at least some time tracking data
    if (!event.timeTracking || event.timeTracking.length === 0) {
      return;
    }
    
    onMoveToPostProduction(event.id);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Active Production Events</h2>
      
      {productionEvents.length > 0 ? (
        productionEvents.map(event => (
          <Card
            key={event.id}
            className={`p-4 cursor-pointer hover:border-primary transition-colors ${
              selectedEvent?.id === event.id ? "border-primary" : ""
            }`}
            onClick={() => onSelectEvent(event)}
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
            </div>
            
            {event.timeTracking && event.timeTracking.length > 0 && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                  {event.timeTracking.length} time entries
                </span>
                
                {selectedEvent?.id === event.id && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveToPostProduction(event);
                    }}
                    className="text-xs flex items-center"
                  >
                    Move to Post-Production
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            )}
          </Card>
        ))
      ) : (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">No active production events</p>
        </div>
      )}
    </div>
  );
}
