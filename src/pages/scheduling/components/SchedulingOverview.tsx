
import { UpcomingEventsCalendar } from "@/components/scheduling/UpcomingEventsCalendar";
import { ScheduledEvent } from "@/components/scheduling/types";
import { Card } from "@/components/ui/card";
import { FileText, Camera, Film } from "lucide-react";

interface SchedulingOverviewProps {
  events: ScheduledEvent[];
  getEventsByStage: (stage: "pre-production" | "production" | "post-production" | "completed") => ScheduledEvent[];
}

export function SchedulingOverview({ events, getEventsByStage }: SchedulingOverviewProps) {
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
            {getEventsByStage("pre-production").length > 0 ? (
              getEventsByStage("pre-production").map(event => (
                <div key={event.id} className="p-2 border-l-2 border-indigo-400 pl-3">
                  <p className="font-medium">{event.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
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
            {getEventsByStage("production").length > 0 ? (
              getEventsByStage("production").map(event => (
                <div key={event.id} className="p-2 border-l-2 border-amber-400 pl-3">
                  <p className="font-medium">{event.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
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
            {getEventsByStage("post-production").length > 0 ? (
              getEventsByStage("post-production").map(event => (
                <div key={event.id} className="p-2 border-l-2 border-green-400 pl-3">
                  <p className="font-medium">{event.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No post-production events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
