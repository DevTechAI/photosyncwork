import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScheduledEvent } from "./types";
import { getApprovedEstimates } from "./utils/estimatesHelpers";
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
    clientEmail: "",
    photographersCount: 1,
    videographersCount: 1,
    stage: "pre-production"
  });
  
  const [approvedEstimates, setApprovedEstimates] = useState<any[]>([]);
  const [selectedEstimateId, setSelectedEstimateId] = useState<string>("");
  
  useEffect(() => {
    if (open) {
      const estimates = getApprovedEstimates();
      setApprovedEstimates(estimates);
    }
  }, [open]);

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
  
  const handleEstimateChange = (estimateId: string) => {
    setSelectedEstimateId(estimateId);
    
    if (!estimateId) {
      setEventData(prev => ({
        ...prev,
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        photographersCount: 1,
        videographersCount: 1,
        clientRequirements: "",
        deliverables: []
      }));
      return;
    }
    
    const selectedEstimate = approvedEstimates.find(est => est.id === estimateId);
    if (selectedEstimate) {
      const eventFromEstimate = createEventFromEstimate(selectedEstimate);
      
      setEventData(prev => ({
        ...prev,
        ...eventFromEstimate,
        estimateId: selectedEstimate.id
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventData.name || !eventData.date || !eventData.location || !eventData.clientName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
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
      clientEmail: eventData.clientEmail || "",
      photographersCount: eventData.photographersCount || 1,
      videographersCount: eventData.videographersCount || 1,
      assignments: [],
      stage: "pre-production",
      clientRequirements: eventData.clientRequirements || "",
      deliverables: eventData.deliverables || [],
      estimatePackage: eventData.estimatePackage || ""
    };
    
    onCreateEvent(newEvent);
    toast({
      title: "Event Created",
      description: "The event has been scheduled successfully",
    });
    
    setEventData({
      name: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      clientName: "",
      clientPhone: "",
      clientEmail: "",
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
