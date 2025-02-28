
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction } from "react";

interface ClientRequirementsDialogProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  clientRequirements: string;
}

export function ClientRequirementsDialog({
  isOpen,
  onOpenChange,
  clientRequirements
}: ClientRequirementsDialogProps) {
  const { toast } = useToast();
  
  const handleClose = () => {
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Client Requirements</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Client requirements and special instructions..."
            value={clientRequirements}
            readOnly
            className="min-h-[200px]"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
