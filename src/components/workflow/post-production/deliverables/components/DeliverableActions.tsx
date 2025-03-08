
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Edit, RotateCcw } from "lucide-react";

interface DeliverableActionsProps {
  deliverable: any;
  onUpdateStatus: (deliverableId: string, status: "pending" | "in-progress" | "delivered" | "revision-requested" | "completed") => void;
  onOpenAssignModal: (deliverableId: string) => void;
  onOpenRevisionModal: (deliverableId: string) => void;
}

export function DeliverableActions({
  deliverable,
  onUpdateStatus,
  onOpenAssignModal,
  onOpenRevisionModal
}: DeliverableActionsProps) {
  return (
    <div className="mt-4 flex justify-end space-x-2">
      {!deliverable.assignedTo && (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onOpenAssignModal(deliverable.id)}
        >
          Assign
        </Button>
      )}
      
      {deliverable.status === "pending" && deliverable.assignedTo && (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onUpdateStatus(deliverable.id, "in-progress")}
        >
          Start Work
        </Button>
      )}
      
      {deliverable.status === "in-progress" && (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onUpdateStatus(deliverable.id, "delivered")}
        >
          Mark Delivered
        </Button>
      )}
      
      {deliverable.status === "delivered" && (
        <>
          <Button 
            size="sm" 
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
            onClick={() => onOpenRevisionModal(deliverable.id)}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Request Revision
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-50"
            onClick={() => onUpdateStatus(deliverable.id, "completed")}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Approve
          </Button>
        </>
      )}
      
      {deliverable.status === "revision-requested" && (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onUpdateStatus(deliverable.id, "in-progress")}
        >
          Resume Work
        </Button>
      )}
      
      {deliverable.assignedTo && deliverable.status !== "completed" && (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onOpenAssignModal(deliverable.id)}
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
      )}
    </div>
  );
}
