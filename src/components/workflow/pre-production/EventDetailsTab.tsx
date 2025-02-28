
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Info } from "lucide-react";
import { ScheduledEvent } from "@/components/scheduling/types";

interface EventDetailsTabProps {
  selectedEvent: ScheduledEvent;
}

export function EventDetailsTab({ selectedEvent }: EventDetailsTabProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{selectedEvent.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Event Information</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{selectedEvent.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Approx. {selectedEvent.guestCount || "Unknown"} guests</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Client Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {selectedEvent.clientName}</p>
            <p><span className="font-medium">Phone:</span> {selectedEvent.clientPhone}</p>
            <p><span className="font-medium">Email:</span> {selectedEvent.clientEmail || "Not provided"}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Team Requirements</h3>
        <div className="flex gap-4">
          <div className="px-3 py-2 bg-gray-50 rounded-md text-center">
            <p className="text-sm font-medium">{selectedEvent.photographersCount}</p>
            <p className="text-xs text-muted-foreground">Photographers</p>
          </div>
          <div className="px-3 py-2 bg-gray-50 rounded-md text-center">
            <p className="text-sm font-medium">{selectedEvent.videographersCount}</p>
            <p className="text-xs text-muted-foreground">Videographers</p>
          </div>
        </div>
      </div>
      
      {selectedEvent.estimateId && (
        <div className="mt-6 p-3 bg-blue-50 rounded-md">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Based on Approved Estimate</p>
              <p className="text-xs text-blue-600">Estimate #{selectedEvent.estimateId}</p>
              {selectedEvent.estimatePackage && (
                <p className="text-xs text-blue-600 mt-1">Package: {selectedEvent.estimatePackage}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {selectedEvent.deliverables && selectedEvent.deliverables.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Deliverables</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {selectedEvent.deliverables.map((deliverable, index) => (
              <li key={index} className="text-muted-foreground">
                {deliverable.type === "photos" ? "Photography" : 
                 deliverable.type === "videos" ? "Videography" : 
                 deliverable.type === "album" ? "Wedding Album" : deliverable.type}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
