
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RevisionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestRevision: (notes: string) => void;
}

export function RevisionRequestModal({
  isOpen,
  onClose,
  onRequestRevision
}: RevisionRequestModalProps) {
  const [revisionNotes, setRevisionNotes] = useState<string>("");
  
  const handleRequestRevision = () => {
    onRequestRevision(revisionNotes);
    setRevisionNotes("");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
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
  );
}
