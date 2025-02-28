
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface ClientRequirementsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  initialRequirements?: string;
  onSave: (eventId: string, requirements: string) => void;
}

export function ClientRequirementsDialog({
  isOpen,
  onClose,
  eventId,
  initialRequirements = "",
  onSave
}: ClientRequirementsDialogProps) {
  const [requirements, setRequirements] = useState(initialRequirements);
  const { toast } = useToast();
  
  const handleSave = () => {
    onSave(eventId, requirements);
    toast({
      title: "Requirements Saved",
      description: "Client requirements have been updated successfully.",
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Client Requirements</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Enter client requirements, expectations, and any special instructions..."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Requirements</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
