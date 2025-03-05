
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  // Group events by client
  const eventsByClient = events.reduce((acc, event) => {
    const clientName = event.clientName || 'Unnamed Client';
    if (!acc[clientName]) {
      acc[clientName] = [];
    }
    acc[clientName].push(event);
    return acc;
  }, {} as Record<string, ScheduledEvent[]>);
  
  // State to track which client groups are expanded
  const [expandedClients, setExpandedClients] = useState<Record<string, boolean>>(() => {
    // By default, expand all client groups
    return Object.keys(eventsByClient).reduce((acc, client) => {
      acc[client] = true;
      return acc;
    }, {} as Record<string, boolean>);
  });
  
  // Toggle expanded state for a client
  const toggleClientExpanded = (clientName: string) => {
    setExpandedClients(prev => ({
      ...prev,
      [clientName]: !prev[clientName]
    }));
  };
  
  return (
    <div className="lg:col-span-1 space-y-4">
      <h2 className="text-lg font-medium">Upcoming Events</h2>
      
      {Object.keys(eventsByClient).length > 0 ? (
        Object.entries(eventsByClient).map(([clientName, clientEvents]) => (
          <div key={clientName} className="space-y-2">
            <div 
              className="flex items-center justify-between cursor-pointer p-2 bg-muted rounded-md"
              onClick={() => toggleClientExpanded(clientName)}
            >
              <h3 className="font-medium">{clientName}</h3>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {clientEvents.length} event{clientEvents.length !== 1 ? 's' : ''}
                </Badge>
                <Button variant="ghost" size="sm">
                  {expandedClients[clientName] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {expandedClients[clientName] && clientEvents.map(event => (
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
            ))}
          </div>
        ))
      ) : (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">No upcoming events in pre-production</p>
        </div>
      )}
    </div>
  );
}
