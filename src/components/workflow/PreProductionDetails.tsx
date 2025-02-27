
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduledEvent } from "@/components/scheduling/types";
import { Badge } from "@/components/ui/badge";

interface PreProductionDetailsProps {
  event: ScheduledEvent;
}

export function PreProductionDetails({ event }: PreProductionDetailsProps) {
  // Format the date to be more readable
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Event Name</h3>
                <p>{event.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                <p>{formattedDate}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Start Time</h3>
                <p>{event.startTime}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">End Time</h3>
                <p>{event.endTime}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
              <p>{event.location}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                <p>{event.clientName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
                <p>{event.clientPhone}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Photographers</h3>
                <p>{event.photographersCount}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Videographers</h3>
                <p>{event.videographersCount}</p>
              </div>
            </div>
            
            {event.estimateId && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Based on Estimate</h3>
                <Badge variant="outline">{event.estimateId}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {event.clientRequirements && (
        <Card>
          <CardHeader>
            <CardTitle>Client Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{event.clientRequirements}</p>
          </CardContent>
        </Card>
      )}
      
      {event.deliverables && event.deliverables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Deliverables</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {event.deliverables.map((deliverable, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium capitalize">{deliverable.type}: </span>
                  <Badge variant="outline" className="ml-2 capitalize">
                    {deliverable.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
