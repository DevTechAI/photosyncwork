
import { UpcomingEventsCalendar } from "@/components/scheduling/UpcomingEventsCalendar";
import { ScheduledEvent } from "@/components/scheduling/types";
import { Card } from "@/components/ui/card";
import { FileText, Camera, Film, CheckCircle } from "lucide-react";

interface SchedulingOverviewProps {
  events: ScheduledEvent[];
  getEventsByStage: (stage: "pre-production" | "production" | "post-production" | "completed") => ScheduledEvent[];
}

export function SchedulingOverview({ events, getEventsByStage }: SchedulingOverviewProps) {
  // Helper to check if there are any events for a stage
  const hasEvents = (stage: "pre-production" | "production" | "post-production" | "completed") => {
    return getEventsByStage(stage).length > 0;
  };

  // Helper to get events that were marked as moved from pre-production
  const getCompletedPreProductionEvents = () => {
    return events.filter(event => 
      event.stage === "production" && 
      event.dataCopied === true
    );
  };

  const completedPreProductionEvents = getCompletedPreProductionEvents();

  return (
    <div className="space-y-4">
      <UpcomingEventsCalendar events={events} />
      
      {/* Upcoming Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-lg flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-indigo-500" />
            <span>Pre-Production</span>
          </h3>
          <div className="space-y-3">
            {hasEvents("pre-production") ? (
              getEventsByStage("pre-production").map(event => (
                <div key={event.id} className="p-2 border-l-2 border-indigo-400 pl-3">
                  <p className="font-medium">{event.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">Client: {event.clientName}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No pre-production events</p>
            )}
          </div>
        </div>
        
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-lg flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5 text-amber-500" />
            <span>Production</span>
          </h3>
          <div className="space-y-3">
            {hasEvents("production") ? (
              getEventsByStage("production").map(event => (
                <div key={event.id} className="p-2 border-l-2 border-amber-400 pl-3">
                  <p className="font-medium">
                    {event.name}
                    {event.dataCopied && (
                      <span className="ml-2 inline-flex items-center text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Team Assigned
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">Client: {event.clientName}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No production events</p>
            )}
          </div>
        </div>
        
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-lg flex items-center gap-2 mb-4">
            <Film className="h-5 w-5 text-green-500" />
            <span>Post-Production</span>
          </h3>
          <div className="space-y-3">
            {hasEvents("post-production") ? (
              getEventsByStage("post-production").map(event => (
                <div key={event.id} className="p-2 border-l-2 border-green-400 pl-3">
                  <p className="font-medium">{event.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">Client: {event.clientName}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No post-production events</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Display completed pre-production events if any */}
      {completedPreProductionEvents.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Completed Pre-Production Events</h3>
          <p className="text-sm text-muted-foreground mb-3">
            These events have been prepared and team members have been assigned
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {completedPreProductionEvents.map(event => (
              <div key={event.id} className="border rounded-lg p-3 shadow-sm">
                <div className="flex justify-between items-start">
                  <p className="font-medium">{event.name}</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Team Assigned
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground">Client: {event.clientName}</p>
                
                <div className="mt-2 pt-2 border-t">
                  <p className="text-xs font-medium">Assigned Team:</p>
                  <p className="text-xs text-muted-foreground">
                    {event.assignments.length} team member(s) assigned
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
