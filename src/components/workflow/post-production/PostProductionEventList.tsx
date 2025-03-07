
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Menu } from "lucide-react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PostProductionEventListProps {
  events: ScheduledEvent[];
  selectedEvent: ScheduledEvent | null;
  onSelectEvent: (event: ScheduledEvent) => void;
}

export function PostProductionEventList({ 
  events, 
  selectedEvent, 
  onSelectEvent 
}: PostProductionEventListProps) {
  // State for mobile sidebar toggle
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  
  // Group events by client name
  const groupedEvents = events.reduce<Record<string, ScheduledEvent[]>>((acc, event) => {
    const clientName = event.clientName || 'Unassigned';
    if (!acc[clientName]) {
      acc[clientName] = [];
    }
    acc[clientName].push(event);
    return acc;
  }, {});

  // Sort client names alphabetically
  const sortedClientNames = Object.keys(groupedEvents).sort();

  return (
    <div className="space-y-4">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-between"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
        >
          <span>Post-Production Events</span>
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Sidebar Content - hidden on mobile unless expanded */}
      <div className={`${isMobileExpanded ? 'block' : 'hidden'} lg:block`}>
        <h3 className="font-medium lg:block hidden">Post-Production Events</h3>
        
        {sortedClientNames.length > 0 ? (
          <div className="space-y-6">
            {sortedClientNames.map(clientName => (
              <div key={clientName} className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground border-b pb-1">{clientName}</h4>
                {groupedEvents[clientName].map(event => (
                  <Card
                    key={event.id}
                    className={`p-4 cursor-pointer hover:border-primary transition-colors ${
                      selectedEvent?.id === event.id ? "border-primary" : ""
                    }`}
                    onClick={() => {
                      onSelectEvent(event);
                      // On mobile, collapse sidebar after selection
                      if (window.innerWidth < 1024) {
                        setIsMobileExpanded(false);
                      }
                    }}
                  >
                    <h4 className="font-medium">{event.name}</h4>
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
                      
                      {event.deliverables && event.deliverables.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <span className="font-medium text-xs">
                            Deliverables: {event.deliverables.length}
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {event.deliverables.map((deliverable, index) => (
                              <span 
                                key={index} 
                                className={`text-xs px-2 py-0.5 rounded ${
                                  deliverable.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  deliverable.status === 'revision-requested' ? 'bg-amber-100 text-amber-800' : 
                                  deliverable.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {deliverable.type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 border rounded-md">
            <p className="text-muted-foreground">No events in post-production</p>
          </div>
        )}
      </div>
    </div>
  );
}
