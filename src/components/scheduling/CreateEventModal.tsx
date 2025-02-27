import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScheduledEvent } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getApprovedEstimates, createEventFromEstimate } from "./utils/estimatesHelpers";

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
          {/* Estimate Selection */}
          <div className="space-y-2">
            <Label htmlFor="estimate-select">Based on Approved Estimate</Label>
            <Select
              value={selectedEstimateId}
              onValueChange={handleEstimateChange}
            >
              <SelectTrigger id="estimate-select">
                <SelectValue placeholder="Select an approved estimate (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None (Manual Entry)</SelectItem>
                {approvedEstimates.map((estimate) => (
                  <SelectItem key={estimate.id} value={estimate.id}>
                    {estimate.clientName} - {estimate.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEstimateId && (
              <p className="text-xs text-muted-foreground">
                Event details will be populated from the selected estimate
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event-name">Event Name</Label>
            <Input
              id="event-name"
              value={eventData.name}
              onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
              placeholder="Enter event name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-date">Date</Label>
              <Input
                id="event-date"
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                placeholder="Event venue"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-start">Start Time</Label>
              <Input
                id="event-start"
                type="time"
                value={eventData.startTime}
                onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-end">End Time</Label>
              <Input
                id="event-end"
                type="time"
                value={eventData.endTime}
                onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client-name">Client Name</Label>
            <Input
              id="client-name"
              value={eventData.clientName}
              onChange={(e) => setEventData({ ...eventData, clientName: e.target.value })}
              placeholder="Enter client name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client-phone">Client Phone</Label>
            <Input
              id="client-phone"
              value={eventData.clientPhone}
              onChange={(e) => setEventData({ ...eventData, clientPhone: e.target.value })}
              placeholder="Enter client phone number"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="photographers">Number of Photographers</Label>
              <Input
                id="photographers"
                type="number"
                min="0"
                value={eventData.photographersCount}
                onChange={(e) => setEventData({ ...eventData, photographersCount: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="videographers">Number of Videographers</Label>
              <Input
                id="videographers"
                type="number"
                min="0"
                value={eventData.videographersCount}
                onChange={(e) => setEventData({ ...eventData, videographersCount: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client-requirements">Client Requirements</Label>
            <Input
              id="client-requirements"
              value={eventData.clientRequirements}
              onChange={(e) => setEventData({ ...eventData, clientRequirements: e.target.value })}
              placeholder="Special requests or requirements"
            />
          </div>
          
          <DialogFooter>
            <Button type="submit">Create Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
