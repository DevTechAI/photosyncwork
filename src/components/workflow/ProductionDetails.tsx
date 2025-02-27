
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduledEvent } from "@/components/scheduling/types";
import { Badge } from "@/components/ui/badge";

interface ProductionDetailsProps {
  event: ScheduledEvent;
}

export function ProductionDetails({ event }: ProductionDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Production Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Team Size</h3>
                <p>{event.photographersCount} Photographers, {event.videographersCount} Videographers</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <Badge className="bg-blue-500">In Production</Badge>
              </div>
            </div>
            
            {event.assignments && event.assignments.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Team Assignments</h3>
                <div className="space-y-2">
                  {event.assignments.map((assignment, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <div className="flex justify-between">
                        <span>{assignment.teamMemberId}</span>
                        <Badge variant="outline" className="capitalize">{assignment.status}</Badge>
                      </div>
                      {assignment.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{assignment.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-muted-foreground">No team members assigned yet</p>
              </div>
            )}
            
            {event.clientRequirements && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Client Requirements</h3>
                <p className="text-sm">{event.clientRequirements}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {event.estimateId && (
        <Card>
          <CardHeader>
            <CardTitle>Estimate Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                This production is based on approved estimate: <Badge variant="outline">{event.estimateId}</Badge>
              </p>
              <p className="text-sm text-muted-foreground">
                Ensure all deliverables match the client agreement in the original estimate.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
