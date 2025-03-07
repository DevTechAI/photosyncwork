
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Film, Book, CheckCircle, Edit, RotateCcw } from "lucide-react";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";

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
  // Helper functions
  const getDeliverableTypeIcon = (type: string) => {
    switch (type) {
      case "photos":
        return <Camera className="h-4 w-4" />;
      case "videos":
        return <Film className="h-4 w-4" />;
      case "album":
        return <Book className="h-4 w-4" />;
      default:
        return <Camera className="h-4 w-4" />;
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-yellow-100 text-yellow-800";
      case "revision-requested":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {getDeliverableTypeIcon(deliverable.type)}
          <span className="font-medium capitalize">
            {deliverable.type.charAt(0).toUpperCase() + deliverable.type.slice(1)}
          </span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(deliverable.status)}`}>
          {deliverable.status.replace("-", " ")}
        </span>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Assigned To</p>
          <p className="font-medium">
            {deliverable.assignedTo 
              ? teamMembers.find(tm => tm.id === deliverable.assignedTo)?.name || "Unknown"
              : "Not Assigned"
            }
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Delivery Date</p>
          <p className="font-medium">
            {deliverable.deliveryDate 
              ? new Date(deliverable.deliveryDate).toLocaleDateString()
              : "Not Set"
            }
          </p>
        </div>
      </div>
      
      {deliverable.revisionNotes && (
        <div className="mt-3 p-2 bg-orange-50 rounded text-sm">
          <p className="font-medium text-orange-800">Revision Notes:</p>
          <p className="text-orange-700">{deliverable.revisionNotes}</p>
        </div>
      )}
      
      {deliverable.completedDate && (
        <div className="mt-3 text-xs text-green-600">
          Completed on {new Date(deliverable.completedDate).toLocaleDateString()}
        </div>
      )}
      
      <DeliverableActions 
        deliverable={deliverable}
        onUpdateStatus={onUpdateStatus}
        onOpenAssignModal={onOpenAssignModal}
        onOpenRevisionModal={onOpenRevisionModal}
      />
    </div>
  );
}

interface DeliverableActionsProps {
  deliverable: any;
  onUpdateStatus: (deliverableId: string, status: "pending" | "in-progress" | "delivered" | "revision-requested" | "completed") => void;
  onOpenAssignModal: (deliverableId: string) => void;
  onOpenRevisionModal: (deliverableId: string) => void;
}

function DeliverableActions({
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
