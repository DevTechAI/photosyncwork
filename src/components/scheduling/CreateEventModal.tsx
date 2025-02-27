import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScheduledEvent } from "./types";
import { getApprovedEstimates, createEventFromEstimate } from "./utils/estimatesHelpers";
import { EstimateSelector } from "./components/EstimateSelector";
import { EventBasicDetailsForm } from "./components/EventBasicDetailsForm";
import { ClientDetailsForm } from "./components/ClientDetailsForm";
import { TeamRequirementsForm } from "./components/TeamRequirementsForm";

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onCreateEvent: (event: ScheduledEvent) => void;
  defaultValues?: Partial<ScheduledEvent>;
}

export function CreateEventModal({ 
  open, 
  onClose, 
  onCreateEvent,
  defaultValues 
}: CreateEventModalProps) {
  const { toast } = useToast();
  const [eventData, setEventData] = useState<Partial<ScheduledEvent>>({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    clientName: "",
    clientPhone: "",
    photographersCount: 1,
    videographersCount: 1,
    stage: "pre-production"
  });
  
  const [approvedEstimates, setApprovedEstimates] = useState([]);
  const [selectedEstimateId, setSelectedEstimateId] = useState<string>("");
  
  // Load approved estimates
  useEffect(() => {
    const estimates = getApprovedEstimates();
    setApprovedEstimates(estimates);
  }, [open]);

  // Load default values if provided
  useEffect(() => {
    if (defaultValues) {
      setEventData(prev => ({
        ...prev,
        ...defaultValues
      }));
      
      if (defaultValues.estimateId) {
        setSelectedEstimateId(defaultValues.estimateId);
      }
    }
  }, [defaultValues]);
  
  // Handle estimate selection
  const handleEstimateChange = (estimateId: string) => {
    setSelectedEstimateId(estimateId);
    
    if (!estimateId) {
      // If no estimate selected, clear relevant fields but keep others
      setEventData(prev => ({
        ...prev,
        clientName: "",
        clientPhone: "",
        photographersCount: 1,
        videographersCount: 1,
        clientRequirements: ""
      }));
      return;
    }
    
    const selectedEstimate = approvedEstimates.find(est => est.id === estimateId);
    if (selectedEstimate) {
      const eventFromEstimate = createEventFromEstimate(selectedEstimate);
      setEventData(prev => ({
        ...prev,
        ...eventFromEstimate
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!eventData.name || !eventData.date || !eventData.location || !eventData.clientName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Generate unique ID
    const newEvent: ScheduledEvent = {
      id: `evt-${Date.now()}`,
      estimateId: selectedEstimateId || `est-${Date.now()}`,
      name: eventData.name || "",
      date: eventData.date || "",
      startTime: eventData.startTime || "09:00",
      endTime: eventData.endTime || "17:00",
      location: eventData.location || "",
      clientName: eventData.clientName || "",
      clientPhone: eventData.clientPhone || "",
      photographersCount: eventData.photographersCount || 1,
      videographersCount: eventData.videographersCount || 1,
      assignments: [],
      stage: "pre-production",
      clientRequirements: eventData.clientRequirements || "",
      deliverables: eventData.deliverables || []
    };
    
    onCreateEvent(newEvent);
    toast({
      title: "Event Created",
      description: "The event has been scheduled successfully",
    });
    
    // Reset form
    setEventData({
      name: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      clientName: "",
      clientPhone: "",
      photographersCount: 1,
      videographersCount: 1,
      stage: "pre-production"
    });
    setSelectedEstimateId("");
    
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Schedule New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <EstimateSelector 
            selectedEstimateId={selectedEstimateId}
            approvedEstimates={approvedEstimates}
            onEstimateChange={handleEstimateChange}
          />
          
          <EventBasicDetailsForm 
            eventData={eventData}
            setEventData={setEventData}
          />
          
          <ClientDetailsForm 
            eventData={eventData}
            setEventData={setEventData}
          />
          
          <TeamRequirementsForm 
            eventData={eventData}
            setEventData={setEventData}
          />
          
          <DialogFooter>
            <Button type="submit">Create Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
