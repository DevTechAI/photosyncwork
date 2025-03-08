
import React from "react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { DeliverableHeader } from "./components/DeliverableHeader";
import { DeliverableDetails } from "./components/DeliverableDetails";
import { DeliverableActions } from "./components/DeliverableActions";

interface DeliverableItemProps {
  deliverable: any;
  teamMembers: TeamMember[];
  onUpdateStatus: (deliverableId: string, status: "pending" | "in-progress" | "delivered" | "revision-requested" | "completed") => void;
  onOpenAssignModal: (deliverableId: string) => void;
  onOpenRevisionModal: (deliverableId: string) => void;
}

export function DeliverableItem({ 
  deliverable, 
  teamMembers, 
  onUpdateStatus, 
  onOpenAssignModal, 
  onOpenRevisionModal 
}: DeliverableItemProps) {
  return (
    <div className="border rounded-md p-4">
      <DeliverableHeader
        type={deliverable.type}
        status={deliverable.status}
      />
      
      <DeliverableDetails
        assignedTo={deliverable.assignedTo}
        deliveryDate={deliverable.deliveryDate}
        revisionNotes={deliverable.revisionNotes}
        completedDate={deliverable.completedDate}
        teamMembers={teamMembers}
      />
      
      <DeliverableActions 
        deliverable={deliverable}
        onUpdateStatus={onUpdateStatus}
        onOpenAssignModal={onOpenAssignModal}
        onOpenRevisionModal={onOpenRevisionModal}
      />
    </div>
  );
}
