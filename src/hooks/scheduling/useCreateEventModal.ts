
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useEstimateToEventConverter } from "./useEstimateToEventConverter";
import { getApprovedEstimates } from "@/components/scheduling/utils/approvedEstimatesLoader";
import { createScheduledEventFromEstimateEvent } from "@/components/scheduling/utils/eventCreator";
import { saveEvent } from "@/components/scheduling/utils/eventPersistence";
import { checkEventExistsForEstimateEvent } from "@/components/scheduling/utils/eventExistenceChecker";
import { ScheduledEvent } from "@/components/scheduling/types";
import { z } from "zod";

// Define event form schema using zod
export const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  guestCount: z.number().int().positive().default(1),
  photographersCount: z.number().int().nonnegative().default(1),
  videographersCount: z.number().int().nonnegative().default(0),
  clientRequirements: z.string().optional(),
  references: z.array(z.string()).default([])
});

// Export the type derived from the schema
export type EventFormValues = z.infer<typeof eventFormSchema>;

// Define tab types for the modal
export type ModalTab = "details" | "client" | "team" | "estimate";

export function useCreateEventModal(
  initialEstimateId: string | undefined, 
  onCreateEvent: (event: ScheduledEvent) => void,
  onClose: () => void
) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ModalTab>("details");
  const [selectedEstimateId, setSelectedEstimateId] = useState(initialEstimateId || "");
  const [approvedEstimates, setApprovedEstimates] = useState<any[]>([]);
  
  // Form handling with zod validation
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EventFormValues>({
    defaultValues: {
      name: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      guestCount: 1,
      photographersCount: 1,
      videographersCount: 0,
      clientRequirements: "",
      references: []
    }
  });
  
  const { convertEstimateToEvent } = useEstimateToEventConverter();
  
  // Load estimates from storage
  const loadEstimates = async () => {
    try {
      const estimates = await getApprovedEstimates();
      setApprovedEstimates(estimates);
      
      if (initialEstimateId) {
        setSelectedEstimateId(initialEstimateId);
      }
    } catch (error) {
      console.error("Error loading estimates:", error);
      toast({
        title: "Error",
        description: "Failed to load approved estimates.",
        variant: "destructive",
      });
    }
  };
  
  // Handle form submission
  const handleSubmitForm = async (data: EventFormValues) => {
    try {
      // Check if this event already exists
      const eventExists = await checkEventExistsForEstimateEvent(
        selectedEstimateId, 
        data.name
      );
      
      if (eventExists) {
        toast({
          title: "Event Already Exists",
          description: "An event with the same name already exists for this estimate.",
          variant: "destructive",
        });
        return;
      }
      
      // Create new event
      const newEvent: ScheduledEvent = {
        id: crypto.randomUUID(),
        estimateId: selectedEstimateId,
        name: data.name,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        clientName: data.clientName,
        clientPhone: data.clientPhone || "",
        clientEmail: data.clientEmail,
        guestCount: data.guestCount.toString(),
        photographersCount: data.photographersCount,
        videographersCount: data.videographersCount,
        assignments: [],
        notes: "",
        stage: "pre-production",
        clientRequirements: data.clientRequirements || "",
        references: data.references || [],
        timeTracking: [],
      };
      
      // Save the event
      await saveEvent(newEvent);
      
      toast({
        title: "Event Created",
        description: "Event has been successfully created and scheduled.",
      });
      
      // Call the provided onCreateEvent callback
      onCreateEvent(newEvent);
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Create event from an estimate
  const handleCreateFromEstimate = async () => {
    if (!selectedEstimateId) {
      toast({
        title: "No Estimate Selected",
        description: "Please select an estimate to continue.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const estimate = approvedEstimates.find(est => est.id === selectedEstimateId);
      
      if (!estimate) {
        toast({
          title: "Error",
          description: "Selected estimate not found.",
          variant: "destructive",
        });
        return;
      }
      
      // Determine which package was selected
      const selectedPackageIndex = estimate.selectedPackageIndex || 0;
      
      // Get the services from the selected package
      let services = [];
      if (estimate.packages && estimate.packages.length > selectedPackageIndex) {
        services = estimate.packages[selectedPackageIndex].services || [];
      } else {
        services = estimate.services || [];
      }
      
      if (services.length === 0) {
        toast({
          title: "No Services",
          description: "The selected estimate does not contain any services to create an event from.",
          variant: "destructive",
        });
        return;
      }
      
      // Get the first service to create an event
      const eventData = services[0];
      const newEvent = createScheduledEventFromEstimateEvent(estimate, eventData, selectedPackageIndex);
      
      // Save the event
      await saveEvent(newEvent);
      
      toast({
        title: "Event Created",
        description: "Event has been successfully created from the estimate.",
      });
      
      onCreateEvent(newEvent);
      onClose();
    } catch (error) {
      console.error("Error creating event from estimate:", error);
      toast({
        title: "Error",
        description: "Failed to create event from estimate. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return {
    activeTab,
    setActiveTab,
    selectedEstimateId,
    setSelectedEstimateId,
    approvedEstimates,
    register,
    handleSubmit,
    setValue, 
    errors,
    loadEstimates,
    handleSubmitForm,
    handleCreateFromEstimate
  };
}
