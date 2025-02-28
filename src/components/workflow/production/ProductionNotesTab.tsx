
import { useState } from "react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MessageSquare, FileText } from "lucide-react";
import { ClientRequirementsDialog } from "./ClientRequirementsDialog";
import { useToast } from "@/components/ui/use-toast";

interface ProductionNotesTabProps {
  events: ScheduledEvent[];
}

export function ProductionNotesTab({ events }: ProductionNotesTabProps) {
  // Filter events to only show production events
  const productionEvents = events.filter(event => event.stage === "production");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isRequirementsDialogOpen, setIsRequirementsDialogOpen] = useState(false);
  const [teamObservation, setTeamObservation] = useState("");
  const { toast } = useToast();

  // Find the selected event
  const selectedEvent = productionEvents.find(event => event.id === selectedEventId);
  
  const handleSaveRequirements = (eventId: string, requirements: string) => {
    // This would update the event with new requirements
    // For now we just show a toast
    toast({
      title: "Requirements Saved",
      description: "Client requirements have been saved successfully.",
    });
  };

  const handleSaveObservation = () => {
    if (!teamObservation.trim()) {
      toast({
        title: "Empty Observation",
        description: "Please enter an observation before saving.",
        variant: "destructive"
      });
      return;
    }
    
    // This would save the team observation
    // For now we just show a toast and clear the field
    toast({
      title: "Observation Saved",
      description: "Team observation has been saved successfully.",
    });
    setTeamObservation("");
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Production Notes</h3>
      
      {productionEvents.length > 0 ? (
        productionEvents.map(event => (
          <Card key={event.id} className="p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{event.name}</h4>
              <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                {new Date(event.date).toLocaleDateString()}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-medium">Client Requirements</h5>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedEventId(event.id);
                    setIsRequirementsDialogOpen(true);
                  }}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  {event.clientRequirements ? "Edit" : "Add"} Requirements
                </Button>
              </div>
              
              {event.clientRequirements ? (
                <p className="text-sm bg-gray-50 p-3 rounded">{event.clientRequirements}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No client requirements recorded</p>
              )}
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-medium">Team Observations</h5>
              </div>
              
              {event.id === selectedEventId ? (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Enter team observations, technical notes, or issues encountered..."
                    value={teamObservation}
                    onChange={(e) => setTeamObservation(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedEventId(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSaveObservation}
                    >
                      Save Observation
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">No team observations recorded</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEventId(event.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">No production events found</p>
        </div>
      )}

      {/* Client Requirements Dialog */}
      {selectedEventId && (
        <ClientRequirementsDialog
          isOpen={isRequirementsDialogOpen}
          onClose={() => {
            setIsRequirementsDialogOpen(false);
            setSelectedEventId(null);
          }}
          eventId={selectedEventId}
          initialRequirements={selectedEvent?.clientRequirements || ""}
          onSave={handleSaveRequirements}
        />
      )}
    </div>
  );
}
