
import React from "react";
import { TeamMember } from "@/components/scheduling/types";

interface DeliverableDetailsProps {
  assignedTo?: string;
  deliveryDate?: string;
  revisionNotes?: string;
  completedDate?: string;
  teamMembers: TeamMember[];
}

export function DeliverableDetails({ 
  assignedTo, 
  deliveryDate, 
  revisionNotes, 
  completedDate, 
  teamMembers 
}: DeliverableDetailsProps) {
  return (
    <>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Assigned To</p>
          <p className="font-medium">
            {assignedTo 
              ? teamMembers.find(tm => tm.id === assignedTo)?.name || "Unknown"
              : "Not Assigned"
            }
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Delivery Date</p>
          <p className="font-medium">
            {deliveryDate 
              ? new Date(deliveryDate).toLocaleDateString()
              : "Not Set"
            }
          </p>
        </div>
      </div>
      
      {revisionNotes && (
        <div className="mt-3 p-2 bg-orange-50 rounded text-sm">
          <p className="font-medium text-orange-800">Revision Notes:</p>
          <p className="text-orange-700">{revisionNotes}</p>
        </div>
      )}
      
      {completedDate && (
        <div className="mt-3 text-xs text-green-600">
          Completed on {new Date(completedDate).toLocaleDateString()}
        </div>
      )}
    </>
  );
}
