
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Camera, Film, Book, CheckCircle, Edit, RotateCcw } from "lucide-react";

interface PostProductionDeliverablesProps {
  selectedEvent: ScheduledEvent;
  setSelectedEvent: (event: ScheduledEvent) => void;
  updateEvents: (updatedEvent: ScheduledEvent) => void;
  teamMembers: TeamMember[];
}

export function PostProductionDeliverables({ 
  selectedEvent, 
  setSelectedEvent, 
  updateEvents,
  teamMembers 
}: PostProductionDeliverablesProps) {
  const { toast } = useToast();
  
  const [isAssignDeliverableModalOpen, setIsAssignDeliverableModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string | null>(null);
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [revisionNotes, setRevisionNotes] = useState<string>("");
  
  const handleOpenAssignModal = (deliverableId: string) => {
    setSelectedDeliverableId(deliverableId);
    
    // Find the deliverable to pre-fill the form
    if (selectedEvent && selectedEvent.deliverables) {
      const deliverable = selectedEvent.deliverables.find(d => d.id === deliverableId);
      if (deliverable) {
        setSelectedTeamMemberId(deliverable.assignedTo || "");
        setDeliveryDate(deliverable.deliveryDate || "");
      }
    }
    
    setIsAssignDeliverableModalOpen(true);
  };
  
  const handleAssignDeliverable = () => {
    if (!selectedEvent || !selectedDeliverableId) return;
    
    // Update the deliverable
    const updatedEvent = {
      ...selectedEvent,
      deliverables: selectedEvent.deliverables?.map(deliverable => 
        deliverable.id === selectedDeliverableId
          ? { 
              ...deliverable, 
              assignedTo: selectedTeamMemberId,
              deliveryDate,
              status: "in-progress" as const
            }
          : deliverable
      )
    };
    
    // Update events state
    updateEvents(updatedEvent);
    setSelectedEvent(updatedEvent);
    setIsAssignDeliverableModalOpen(false);
    
    toast({
      title: "Deliverable Assigned",
      description: "The deliverable has been assigned and is now in progress."
    });
  };
  
  const handleUpdateDeliverableStatus = (deliverableId: string, status: "pending" | "in-progress" | "delivered" | "revision-requested" | "completed") => {
    if (!selectedEvent) return;
    
    // Update the deliverable status
    const updatedEvent = {
      ...selectedEvent,
      deliverables: selectedEvent.deliverables?.map(deliverable => 
        deliverable.id === deliverableId
          ? { 
              ...deliverable, 
              status,
              completedDate: status === "completed" ? new Date().toISOString().split('T')[0] : deliverable.completedDate
            }
          : deliverable
      )
    };
    
    // Update events state
    updateEvents(updatedEvent);
    setSelectedEvent(updatedEvent);
    
    toast({
      title: "Status Updated",
      description: `Deliverable status has been updated to ${status.replace("-", " ")}.`
    });
  };
  
  const handleOpenRevisionModal = (deliverableId: string) => {
    setSelectedDeliverableId(deliverableId);
    setIsRevisionModalOpen(true);
  };
  
  const handleRequestRevision = () => {
    if (!selectedEvent || !selectedDeliverableId) return;
    
    // Update the deliverable
    const updatedEvent = {
      ...selectedEvent,
      deliverables: selectedEvent.deliverables?.map(deliverable => 
        deliverable.id === selectedDeliverableId
          ? { 
              ...deliverable, 
              status: "revision-requested" as const,
              revisionNotes
            }
          : deliverable
      )
    };
    
    // Update events state
    updateEvents(updatedEvent);
    setSelectedEvent(updatedEvent);
    setIsRevisionModalOpen(false);
    
    toast({
      title: "Revision Requested",
      description: "A revision has been requested for the deliverable."
    });
  };
  
  const handleCompleteAllDeliverables = () => {
    if (!selectedEvent) return;
    
    // Check if all deliverables are completed
    const allCompleted = selectedEvent.deliverables?.every(d => d.status === "completed");
    
    if (!allCompleted) {
      toast({
        title: "Cannot Complete Event",
        description: "All deliverables must be completed before moving the event to completed status.",
        variant: "destructive"
      });
      return;
    }
    
    // Update event stage to completed
    const updatedEvent = {
      ...selectedEvent,
      stage: "completed" as const
    };
    
    // Update events state - this will remove it from the post-production list
    updateEvents(updatedEvent);
    
    // Since we're completing this event, we should clear the selected event
    setSelectedEvent(null);
    
    toast({
      title: "Event Completed",
      description: "All deliverables are completed and the event has been marked as completed."
    });
  };
  
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
  
  // Filter team members by role
  const getTeamMembersByRole = (role: string) => {
    return teamMembers.filter(tm => 
      role === "album" 
        ? tm.role === "album_designer" 
        : tm.role === "editor"
    );
  };
  
  // Check if all deliverables are assigned
  const areAllDeliverablesAssigned = selectedEvent?.deliverables?.every(d => d.assignedTo);
  
  // Check if the event is ready for completion
  const isReadyForCompletion = selectedEvent?.deliverables?.every(d => d.status === "completed");
  
  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Deliverables</h2>
          {areAllDeliverablesAssigned && isReadyForCompletion && (
            <Button 
              onClick={handleCompleteAllDeliverables}
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
              <div 
                key={deliverable.id} 
                className="border rounded-md p-4"
              >
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
                
                <div className="mt-4 flex justify-end space-x-2">
                  {!deliverable.assignedTo && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleOpenAssignModal(deliverable.id)}
                    >
                      Assign
                    </Button>
                  )}
                  
                  {deliverable.status === "pending" && deliverable.assignedTo && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUpdateDeliverableStatus(deliverable.id, "in-progress")}
                    >
                      Start Work
                    </Button>
                  )}
                  
                  {deliverable.status === "in-progress" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUpdateDeliverableStatus(deliverable.id, "delivered")}
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
                        onClick={() => handleOpenRevisionModal(deliverable.id)}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Request Revision
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-green-500 text-green-500 hover:bg-green-50"
                        onClick={() => handleUpdateDeliverableStatus(deliverable.id, "completed")}
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
                      onClick={() => handleUpdateDeliverableStatus(deliverable.id, "in-progress")}
                    >
                      Resume Work
                    </Button>
                  )}
                  
                  {deliverable.assignedTo && deliverable.status !== "completed" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleOpenAssignModal(deliverable.id)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No deliverables found for this event</p>
        )}
      </Card>

      {/* Assign Deliverable Modal */}
      <Dialog open={isAssignDeliverableModalOpen} onOpenChange={setIsAssignDeliverableModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Deliverable</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedDeliverableId && selectedEvent?.deliverables && (
              <>
                <div className="space-y-2">
                  <Label>Deliverable Type</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    {getDeliverableTypeIcon(
                      selectedEvent.deliverables.find(d => d.id === selectedDeliverableId)?.type || "photos"
                    )}
                    <span className="capitalize">
                      {selectedEvent.deliverables.find(d => d.id === selectedDeliverableId)?.type || ""}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="team-member">Assign To</Label>
                  <Select 
                    value={selectedTeamMemberId} 
                    onValueChange={setSelectedTeamMemberId}
                  >
                    <SelectTrigger id="team-member">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTeamMembersByRole(
                        selectedEvent.deliverables.find(d => d.id === selectedDeliverableId)?.type || "photos"
                      ).map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delivery-date">Delivery Date</Label>
                  <Input
                    id="delivery-date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDeliverableModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignDeliverable} disabled={!selectedTeamMemberId || !deliveryDate}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Revision Request Modal */}
      <Dialog open={isRevisionModalOpen} onOpenChange={setIsRevisionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Revision</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="revision-notes">Revision Notes</Label>
              <Textarea
                id="revision-notes"
                placeholder="Enter detailed revision instructions..."
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevisionModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleRequestRevision} 
              disabled={!revisionNotes}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Request Revision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
