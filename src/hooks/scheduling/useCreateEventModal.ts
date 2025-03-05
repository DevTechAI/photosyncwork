import { useState, useEffect } from "react";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { ScheduledEvent } from "@/components/scheduling/types";
import { getApprovedEstimates } from "@/components/scheduling/utils/approvedEstimatesLoader";
import { createScheduledEventFromEstimateEvent } from "@/components/scheduling/utils/eventCreator";

// Event form validation schema
export const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  guestCount: z.number().min(1, "Guest count must be at least 1").optional(),
  photographersCount: z.string().transform(val => parseInt(val) || 0),
  videographersCount: z.string().transform(val => parseInt(val) || 0),
  clientRequirements: z.string().optional(),
  references: z.array(z.string()).default([])
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export function useCreateEventModal(
  initialEstimateId?: string,
  onCreateEvent?: (event: ScheduledEvent) => void,
  onClose?: () => void
) {
  const [activeTab, setActiveTab] = useState("details");
  const [selectedEstimateId, setSelectedEstimateId] = useState<string | null>(initialEstimateId || null);
  const [approvedEstimates, setApprovedEstimates] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Load approved estimates when the component mounts
  useEffect(() => {
    const loadApprovedEstimates = async () => {
      try {
        const estimates = await getApprovedEstimates();
        setApprovedEstimates(estimates);
      } catch (error) {
        console.error("Error loading approved estimates:", error);
      }
    };
    
    loadApprovedEstimates();
  }, []);
  
  useEffect(() => {
    if (initialEstimateId) {
      setSelectedEstimateId(initialEstimateId);
    }
  }, [initialEstimateId]);
  
  const handleSubmitForm = (data: EventFormValues) => {
    if (!onCreateEvent) return;
    
    // Create a new event object
    const newEvent: ScheduledEvent = {
      id: crypto.randomUUID(),
      estimateId: selectedEstimateId || null,
      name: data.name,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      clientEmail: data.clientEmail || "",
      guestCount: data.guestCount,
      photographersCount: data.photographersCount,
      videographersCount: data.videographersCount,
      assignments: [],
      notes: "",
      stage: "pre-production",
      clientRequirements: data.clientRequirements || "",
      references: data.references || [],
      timeTracking: [],
      deliverables: [],
      dataCopied: false,
      estimatePackage: ""
    };
    
    // Call the onCreateEvent prop with the new event
    onCreateEvent(newEvent);
    
    // Close the modal
    if (onClose) onClose();
    
    // Show success message
    toast({
      title: "Event Created",
      description: `${data.name} has been created.`,
    });
  };
  
  const handleCreateFromEstimate = async () => {
    if (!selectedEstimateId || !onCreateEvent || !onClose) return;
    
    try {
      // Find the selected estimate from our loaded estimates
      const selectedEstimate = approvedEstimates.find(est => est.id === selectedEstimateId);
      
      if (!selectedEstimate) {
        throw new Error("Selected estimate not found");
      }
      
      // Get selected package index or default to first
      const selectedPackageIndex = selectedEstimate.selectedPackageIndex || 0;
      
      // Get the services from the selected package
      let services = [];
      if (selectedEstimate.packages && selectedEstimate.packages.length > selectedPackageIndex) {
        services = selectedEstimate.packages[selectedPackageIndex].services || [];
      } else {
        services = selectedEstimate.services || [];
      }
      
      if (!services || services.length === 0) {
        throw new Error("No services found in the selected estimate");
      }
      
      // Create an event using the first service
      const newEvent = createScheduledEventFromEstimateEvent(
        selectedEstimate, 
        services[0],
        selectedPackageIndex
      );
      
      // Call the onCreateEvent prop with the generated event
      onCreateEvent(newEvent);
      
      // Close the modal
      onClose();
      
      // Show success message
      toast({
        title: "Event Created",
        description: `${newEvent.name} has been created from the selected estimate.`,
      });
    } catch (error) {
      console.error("Error creating event from estimate:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create event from estimate.",
      });
    }
  };

  return {
    activeTab,
    setActiveTab,
    selectedEstimateId,
    setSelectedEstimateId,
    approvedEstimates,
    handleSubmitForm,
    handleCreateFromEstimate
  };
}
