
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useEventModalState } from "./useEventModalState";
import { useEstimatesLoader } from "./useEstimatesLoader";
import { useEventFromEstimate } from "./useEventFromEstimate";
import { useEventSubmission } from "./useEventSubmission";

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
  // Use our smaller hooks
  const {
    activeTab,
    setActiveTab,
    selectedEstimateId,
    setSelectedEstimateId,
    approvedEstimates,
    setApprovedEstimates
  } = useEventModalState(initialEstimateId);
  
  const { loadEstimates } = useEstimatesLoader(
    setApprovedEstimates,
    initialEstimateId,
    setSelectedEstimateId
  );
  
  const { handleCreateFromEstimate } = useEventFromEstimate(onCreateEvent, onClose);
  const { handleSubmitForm } = useEventSubmission(onCreateEvent, onClose);
  
  // Form handling with react-hook-form
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
    handleSubmitForm: (data: EventFormValues) => handleSubmitForm(data, selectedEstimateId),
    handleCreateFromEstimate: () => handleCreateFromEstimate(selectedEstimateId, approvedEstimates)
  };
}
