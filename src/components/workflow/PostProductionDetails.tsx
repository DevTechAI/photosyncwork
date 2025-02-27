
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduledEvent } from "@/components/scheduling/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PostProductionDetailsProps {
  event: ScheduledEvent;
}

export function PostProductionDetails({ event }: PostProductionDetailsProps) {
  const [deliverables, setDeliverables] = useState(event.deliverables || []);
  
  const updateDeliverableStatus = (index: number, newStatus: string) => {
    const updatedDeliverables = [...deliverables];
    updatedDeliverables[index] = {
      ...updatedDeliverables[index],
      status: newStatus as "pending" | "in-progress" | "delivered" | "revision-requested" | "completed"
    };
    setDeliverables(updatedDeliverables);
    
    // In a real app, you would save this to your database or local storage
    console.log("Updated deliverable status:", updatedDeliverables);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Post-Production Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Client Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Client</p>
                  <p className="text-sm">{event.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-sm">{event.clientPhone}</p>
                </div>
              </div>
            </div>
            
            {event.estimateId && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Based on Estimate</h3>
                <Badge variant="outline">{event.estimateId}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Deliverables Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          {deliverables && deliverables.length > 0 ? (
            <div className="space-y-4">
              {deliverables.map((deliverable, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium capitalize">{deliverable.type}</h4>
                      <div className="mt-1 space-x-2">
                        <Badge 
                          className={`capitalize ${
                            deliverable.status === "completed" ? "bg-green-500" :
                            deliverable.status === "in-progress" ? "bg-blue-500" :
                            deliverable.status === "delivered" ? "bg-purple-500" :
                            deliverable.status === "revision-requested" ? "bg-amber-500" :
                            "bg-gray-500"
                          }`}
                        >
                          {deliverable.status}
                        </Badge>
                        
                        {deliverable.assignedTo && (
                          <Badge variant="outline">Assigned to: {deliverable.assignedTo}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {deliverable.status !== "in-progress" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateDeliverableStatus(index, "in-progress")}
                        >
                          Start
                        </Button>
                      )}
                      
                      {deliverable.status === "in-progress" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateDeliverableStatus(index, "delivered")}
                        >
                          Mark Delivered
                        </Button>
                      )}
                      
                      {deliverable.status === "delivered" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateDeliverableStatus(index, "completed")}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {deliverable.deliveryDate && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Delivery date: {new Date(deliverable.deliveryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 border border-dashed rounded-md">
              <p className="text-muted-foreground">No deliverables tracked for this project</p>
              <p className="text-sm text-muted-foreground mt-1">
                Deliverables are typically imported from the approved estimate
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
