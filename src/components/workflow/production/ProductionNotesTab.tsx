
import { ScheduledEvent } from "@/components/scheduling/types";

interface ProductionNotesTabProps {
  events: ScheduledEvent[];
}

export function ProductionNotesTab({ events }: ProductionNotesTabProps) {
  // Filter events to only show production events
  const productionEvents = events.filter(event => event.stage === "production");
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Production Notes</h3>
      
      {productionEvents.length > 0 ? (
        productionEvents.map(event => (
          <div key={event.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{event.name}</h4>
              <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                {new Date(event.date).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-4">
              <h5 className="text-sm font-medium mb-2">Client Inputs During Shoot</h5>
              <p className="text-sm text-muted-foreground">No client inputs recorded</p>
            </div>
            <div className="mt-4">
              <h5 className="text-sm font-medium mb-2">Team Observations</h5>
              <p className="text-sm text-muted-foreground">No team observations recorded</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">No production events found</p>
        </div>
      )}
    </div>
  );
}
