
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { CheckCircle } from "lucide-react";
import { DeliverableItem } from "./DeliverableItem";

interface DeliverablesContainerProps {
  selectedEvent: ScheduledEvent;
  teamMembers: TeamMember[];
  onUpdateDeliverableStatus: (deliverableId: string, status: "pending" | "in-progress" | "delivered" | "revision-requested" | "completed") => void;
  onOpenAssignModal: (deliverableId: string) => void;
  onOpenRevisionModal: (deliverableId: string) => void;
  onCompleteAllDeliverables: () => void;
  areAllDeliverablesAssigned: boolean;
  isReadyForCompletion: boolean;
}

export function DeliverablesContainer({
  selectedEvent,
  teamMembers,
  onUpdateDeliverableStatus,
  onOpenAssignModal,
  onOpenRevisionModal,
  onCompleteAllDeliverables,
  areAllDeliverablesAssigned,
  isReadyForCompletion
}: DeliverablesContainerProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Deliverables</h2>
        {areAllDeliverablesAssigned && isReadyForCompletion && (
          <Button 
            onClick={onCompleteAllDeliverables}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete All Deliverables
          </Button>
        )}
      </div>
      
      {selectedEvent.deliverables && selectedEvent.deliverables.length > 0 ? (
        <div className="space-y-4">
          {selectedEvent.deliverables.map(deliverable => (
            <DeliverableItem
              key={deliverable.id}
              deliverable={deliverable}
              teamMembers={teamMembers}
              onUpdateStatus={onUpdateDeliverableStatus}
              onOpenAssignModal={onOpenAssignModal}
              onOpenRevisionModal={onOpenRevisionModal}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No deliverables found for this event</p>
      )}
    </Card>
  );
}
