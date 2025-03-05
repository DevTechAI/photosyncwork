
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle, Calendar, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Deliverable {
  id: string;
  type: "photos" | "videos" | "album";
  status: "pending" | "in-progress" | "delivered" | "revision-requested" | "completed";
  assignedTo?: string;
  deliveryDate?: string;
  revisionNotes?: string;
  completedDate?: string;
}

interface ProductionDeliverablesTabProps {
  deliverables: Deliverable[];
  eventId: string;
  onUpdateDeliverable?: (eventId: string, updatedDeliverable: Deliverable) => void;
}

export function ProductionDeliverablesTab({ 
  deliverables, 
  eventId, 
  onUpdateDeliverable 
}: ProductionDeliverablesTabProps) {
  const { toast } = useToast();
  const [editingDeliverable, setEditingDeliverable] = useState<Deliverable | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const handleStatusChange = (deliverable: Deliverable, newStatus: Deliverable['status']) => {
    const updatedDeliverable = {
      ...deliverable,
      status: newStatus,
      completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : deliverable.completedDate
    };
    
    if (onUpdateDeliverable) {
      onUpdateDeliverable(eventId, updatedDeliverable);
      toast({
        title: `Status Updated`,
        description: `Deliverable has been marked as ${newStatus.replace('-', ' ')}.`
      });
    } else {
      console.warn("Update handler not provided to ProductionDeliverablesTab");
    }
  };
  
  const handleSaveDeliverable = () => {
    if (!editingDeliverable) return;
    
    if (onUpdateDeliverable) {
      onUpdateDeliverable(eventId, editingDeliverable);
      toast({
        title: "Deliverable Updated",
        description: "The deliverable has been successfully updated."
      });
      setShowEditDialog(false);
    } else {
      console.warn("Update handler not provided to ProductionDeliverablesTab");
    }
  };
  
  const getStatusBadgeVariant = (status: Deliverable['status']) => {
    switch (status) {
      case 'pending':
        return 'outline';
      case 'in-progress':
        return 'secondary';
      case 'delivered':
        return 'default';
      case 'revision-requested':
        return 'destructive';
      case 'completed':
        return 'outline'; // Changed from 'success' to 'outline'
      default:
        return 'outline';
    }
  };
  
  const getDeliverableTypeLabel = (type: Deliverable['type']) => {
    switch (type) {
      case 'photos':
        return 'Photography';
      case 'videos':
        return 'Videography';
      case 'album':
        return 'Album Design';
      default:
        return type;
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Project Deliverables</h3>
      
      {deliverables.length === 0 ? (
        <Card className="p-4">
          <p className="text-center text-muted-foreground">No deliverables found for this event</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {deliverables.map((deliverable) => (
            <Card key={deliverable.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">
                    {getDeliverableTypeLabel(deliverable.type)}
                  </CardTitle>
                  <Badge variant={getStatusBadgeVariant(deliverable.status)}>
                    {deliverable.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4 pt-2">
                <div className="space-y-2 text-sm">
                  {deliverable.assignedTo && (
                    <div className="flex items-center">
                      <UserCircle className="h-4 w-4 mr-2 opacity-70" />
                      <span>{deliverable.assignedTo}</span>
                    </div>
                  )}
                  
                  {deliverable.deliveryDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 opacity-70" />
                      <span>Due: {deliverable.deliveryDate}</span>
                    </div>
                  )}
                  
                  {deliverable.completedDate && (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 opacity-70" />
                      <span>Completed: {deliverable.completedDate}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 space-y-2">
                  {/* Status update buttons based on current status */}
                  {deliverable.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleStatusChange(deliverable, 'in-progress')}
                    >
                      Start Working
                    </Button>
                  )}
                  
                  {deliverable.status === 'in-progress' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleStatusChange(deliverable, 'delivered')}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  
                  {deliverable.status === 'delivered' && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleStatusChange(deliverable, 'revision-requested')}
                      >
                        Request Revision
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-green-50 border-green-200 hover:bg-green-100"
                        onClick={() => handleStatusChange(deliverable, 'completed')}
                      >
                        Approve
                      </Button>
                    </div>
                  )}
                  
                  {deliverable.status === 'revision-requested' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleStatusChange(deliverable, 'in-progress')}
                    >
                      Resume Work
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setEditingDeliverable(deliverable);
                      setShowEditDialog(true);
                    }}
                  >
                    Edit Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Edit Deliverable Dialog */}
      {editingDeliverable && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Deliverable</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="deliverable-status">Status</Label>
                <Select 
                  value={editingDeliverable.status}
                  onValueChange={(value) => setEditingDeliverable({
                    ...editingDeliverable, 
                    status: value as Deliverable['status']
                  })}
                >
                  <SelectTrigger id="deliverable-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="revision-requested">Revision Requested</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assigned-to">Assigned To</Label>
                <Input 
                  id="assigned-to"
                  placeholder="Team member name"
                  value={editingDeliverable.assignedTo || ""}
                  onChange={(e) => setEditingDeliverable({
                    ...editingDeliverable,
                    assignedTo: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery-date">Delivery Date</Label>
                <Input 
                  id="delivery-date"
                  type="date"
                  value={editingDeliverable.deliveryDate || ""}
                  onChange={(e) => setEditingDeliverable({
                    ...editingDeliverable,
                    deliveryDate: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="revision-notes">Notes</Label>
                <Textarea 
                  id="revision-notes"
                  placeholder="Add any notes or revision requests here"
                  value={editingDeliverable.revisionNotes || ""}
                  onChange={(e) => setEditingDeliverable({
                    ...editingDeliverable,
                    revisionNotes: e.target.value
                  })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button onClick={handleSaveDeliverable}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
