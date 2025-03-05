
import { useState, useEffect } from "react";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { ScheduledEvent } from "@/components/scheduling/types";
import { getApprovedEstimates } from "@/components/scheduling/utils/approvedEstimatesLoader";
import { createScheduledEventFromEstimateEvent } from "@/components/scheduling/utils/eventCreator";

// Event form validation schema
export const eventFormSchema = z.object({
  name: z.string().min(3, {
    message: "Event name must be at least 3 characters.",
  }),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  clientName: z.string().min(3, {
    message: "Client name must be at least 3 characters.",
  }),
  clientPhone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  clientEmail: z.string().email({
    message: "Invalid email address.",
  }).optional(),
  guestCount: z.coerce.number().min(1, {
    message: "Guest count must be at least 1.",
  }),
  photographersCount: z.coerce.number().min(0, {
    message: "Photographer count must be at least 0.",
  }),
  videographersCount: z.coerce.number().min(0, {
    message: "Videographer count must be at least 0.",
  }),
  clientRequirements: z.string().optional(),
  references: z.array(z.string()).optional(),
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
