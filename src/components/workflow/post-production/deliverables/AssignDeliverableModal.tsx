
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { Camera, Film, Book } from "lucide-react";

interface AssignDeliverableModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: ScheduledEvent;
  selectedDeliverableId: string | null;
  teamMembers: TeamMember[];
  onAssign: (teamMemberId: string, deliveryDate: string) => void;
}

export function AssignDeliverableModal({
  isOpen,
  onClose,
  selectedEvent,
  selectedDeliverableId,
  teamMembers,
  onAssign
}: AssignDeliverableModalProps) {
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  
  useEffect(() => {
    if (isOpen && selectedDeliverableId && selectedEvent?.deliverables) {
      const deliverable = selectedEvent.deliverables.find(d => d.id === selectedDeliverableId);
      if (deliverable) {
        setSelectedTeamMemberId(deliverable.assignedTo || "");
        setDeliveryDate(deliverable.deliveryDate || "");
      }
    }
  }, [isOpen, selectedDeliverableId, selectedEvent]);
  
  const handleAssign = () => {
    onAssign(selectedTeamMemberId, deliveryDate);
  };
  
  // Get team members by role
  const getTeamMembersByRole = (role: string) => {
    return teamMembers.filter(tm => 
      role === "album" 
        ? tm.role === "album_designer" 
        : tm.role === "editor"
    );
  };
  
  // Get deliverable type icon
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
  
  const selectedDeliverable = selectedDeliverableId 
    ? selectedEvent?.deliverables?.find(d => d.id === selectedDeliverableId)
    : null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Deliverable</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {selectedDeliverableId && selectedEvent?.deliverables && selectedDeliverable && (
            <>
              <div className="space-y-2">
                <Label>Deliverable Type</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  {getDeliverableTypeIcon(selectedDeliverable.type)}
                  <span className="capitalize">
                    {selectedDeliverable.type}
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
                    {getTeamMembersByRole(selectedDeliverable.type).map(member => (
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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAssign} disabled={!selectedTeamMemberId || !deliveryDate}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
