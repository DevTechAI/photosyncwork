
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

interface PostProductionEventDetailsProps {
  selectedEvent: ScheduledEvent;
  setSelectedEvent: (event: ScheduledEvent) => void;
  updateEvents: (updatedEvent: ScheduledEvent) => void;
}

export function PostProductionEventDetails({ 
  selectedEvent, 
  setSelectedEvent, 
  updateEvents 
}: PostProductionEventDetailsProps) {
  const { toast } = useToast();
  const [isDataCopiedModalOpen, setIsDataCopiedModalOpen] = useState(false);
  
  const handleConfirmDataCopied = () => {
    if (!selectedEvent) return;
    
    // Update the event to mark data as copied
    const updatedEvent = {
      ...selectedEvent,
      dataCopied: true
    };
    
    // Update events state
    updateEvents(updatedEvent);
    setSelectedEvent(updatedEvent);
    setIsDataCopiedModalOpen(false);
    
    toast({
      title: "Data Copied",
      description: "Event data has been marked as copied and is ready for editing."
    });
  };
  
  return (
    <>
      <Card className="p-6">
        <h2 className="text-xl font-semibold">{selectedEvent.name}</h2>
        <div className="flex items-center gap-2 mt-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{new Date(selectedEvent.date).toLocaleDateString()}</span>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium">Client Information</h3>
            <p className="text-sm mt-1">{selectedEvent.clientName}</p>
            <p className="text-sm text-muted-foreground">{selectedEvent.clientEmail}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Event Package</h3>
            <p className="text-sm mt-1">
              {selectedEvent.estimatePackage || "Standard Package"}
            </p>
          </div>
        </div>
        
        {!selectedEvent.dataCopied && (
          <div className="mt-6">
            <Button onClick={() => setIsDataCopiedModalOpen(true)}>
              Confirm Data Copied
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Confirm that all raw footage and photos have been copied and are ready for editing
            </p>
          </div>
        )}
      </Card>

      {/* Data Copied Confirmation Modal */}
      <Dialog open={isDataCopiedModalOpen} onOpenChange={setIsDataCopiedModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Data Copied</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Please confirm that all raw footage and photos have been copied from memory cards 
              and are safely stored on your system.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDataCopiedModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDataCopied}>Confirm Data Copied</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
