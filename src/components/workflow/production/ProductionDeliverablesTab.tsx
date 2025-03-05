
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Image as ImageIcon, 
  Video, 
  BookOpen, 
  Check, 
  Clock, 
  Package, 
  XCircle,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Deliverable {
  id: string;
  type: "photos" | "videos" | "album";
  status: "pending" | "completed" | "in-progress" | "delivered" | "revision-requested";
  assignedTo?: string;
  deliveryDate?: string;
  revisionNotes?: string;
  completedDate?: string;
}

interface ProductionDeliverablesTabProps {
  deliverables: (Deliverable | string)[];
  eventId: string;
}

export function ProductionDeliverablesTab({ 
  deliverables, 
  eventId 
}: ProductionDeliverablesTabProps) {
  const { toast } = useToast();
  const [localDeliverables, setLocalDeliverables] = useState<(Deliverable | string)[]>(deliverables);
  
  // Helper function to get status badge variant and label
  const getStatusDisplay = (status: string) => {
    switch(status) {
      case "pending":
        return { variant: "outline" as const, label: "Pending" };
      case "in-progress":
        return { variant: "secondary" as const, label: "In Progress" };
      case "completed":
        return { variant: "default" as const, label: "Completed" };
      case "delivered":
        return { variant: "success" as const, label: "Delivered" };
      case "revision-requested":
        return { variant: "destructive" as const, label: "Revision Requested" };
      default:
        return { variant: "outline" as const, label: "Unknown" };
    }
  };
  
  // Helper function to get icon based on deliverable type
  const getDeliverableIcon = (type: string) => {
    switch(type) {
      case "photos":
        return <ImageIcon className="h-5 w-5" />;
      case "videos":
        return <Video className="h-5 w-5" />;
      case "album":
        return <BookOpen className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };
  
  // Determine if the deliverable is a string or object
  const normalizeDeliverables = () => {
    return localDeliverables.map(deliverable => {
      if (typeof deliverable === 'string') {
        // Display string deliverables as text with default pending status
        return (
          <Card key={deliverable} className="p-4 mb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{deliverable}</div>
                  <div className="text-sm text-muted-foreground">From estimate</div>
                </div>
              </div>
              <Badge variant="outline">Pending</Badge>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleUpdateStatus(deliverable)}
              >
                <Clock className="h-4 w-4 mr-2" />
                Start Work
              </Button>
            </div>
          </Card>
        );
      } else {
        // Display structured deliverable objects
        const { id, type, status } = deliverable;
        const statusDisplay = getStatusDisplay(status);
        
        return (
          <Card key={id} className="p-4 mb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {getDeliverableIcon(type)}
                <div>
                  <div className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                  <div className="text-sm text-muted-foreground">
                    {deliverable.assignedTo ? `Assigned to: ${deliverable.assignedTo}` : 'Not assigned'}
                  </div>
                </div>
              </div>
              <Badge variant={statusDisplay.variant}>{statusDisplay.label}</Badge>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {status === "pending" && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateStatus(deliverable, "in-progress")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Start Work
                </Button>
              )}
              {status === "in-progress" && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateStatus(deliverable, "completed")}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
              {status === "completed" && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateStatus(deliverable, "delivered")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Mark as Delivered
                </Button>
              )}
              {status === "delivered" && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateStatus(deliverable, "revision-requested")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Request Revision
                </Button>
              )}
            </div>
          </Card>
        );
      }
    });
  };
  
  // Update the status of a deliverable
  const handleUpdateStatus = (deliverable: any, newStatus: string = "in-progress") => {
    toast({
      title: "Status Updated",
      description: "This is just a UI mockup. Real status updates will be implemented in a future version.",
    });
    
    // In a real implementation, we would update the deliverable status in the database
    // For now, just show a toast notification
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Deliverables from Estimate</h3>
      </div>
      
      {localDeliverables.length > 0 ? (
        <div>
          {normalizeDeliverables()}
        </div>
      ) : (
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">No deliverables found for this event.</p>
        </Card>
      )}
    </div>
  );
}
