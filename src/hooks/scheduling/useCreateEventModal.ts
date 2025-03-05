
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useEstimateToEventConverter } from "./useEstimateToEventConverter";
import { useToast } from "@/components/ui/use-toast";
import { createEvent } from "@/components/scheduling/utils/eventCreator";
import { loadApprovedEstimates } from "@/components/scheduling/utils/approvedEstimatesLoader";
import { checkEventExistence } from "@/components/scheduling/utils/eventExistenceChecker";
import { convertEstimate } from "@/components/scheduling/utils/estimateConversion";

export function useCreateEventModal(onClose: () => void, onEventCreated: () => void, initialEstimateId?: string) {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(true);
  const [selectedEstimateId, setSelectedEstimateId] = useState(initialEstimateId || "");
  const [approvedEstimates, setApprovedEstimates] = useState([]);
  const [step, setStep] = useState(1);
  const [estimateDetails, setEstimateDetails] = useState<any>(null);
  const [eventBasicDetails, setEventBasicDetails] = useState<any>(null);
  const [clientDetails, setClientDetails] = useState<any>(null);
  const [teamRequirements, setTeamRequirements] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { convertEstimateToEvent } = useEstimateToEventConverter();

  const eventBasicDetailsForm = useForm({
    defaultValues: {
      title: "",
      eventType: "",
      eventDate: undefined,
      startTime: "",
      endTime: "",
      location: "",
      notes: ""
    }
  });

  const clientDetailsForm = useForm({
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      additionalContacts: []
    }
  });

  const teamRequirementsForm = useForm({
    defaultValues: {
      photographers: "1",
      videographers: "1",
      assistants: "0",
      coordinators: "0",
      editors: "0"
    }
  });

  const loadEstimates = async () => {
    try {
      const estimates = await loadApprovedEstimates();
      setApprovedEstimates(estimates);
      
      if (initialEstimateId) {
        handleEstimateSelection(initialEstimateId);
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

  const handleEstimateSelection = (estimateId: string) => {
    setSelectedEstimateId(estimateId);
    
    if (!estimateId) {
      setEstimateDetails(null);
      return;
    }
    
    const selectedEstimate = approvedEstimates.find(est => est.id === estimateId);
    if (selectedEstimate) {
      const convertedEstimate = convertEstimate(selectedEstimate);
      setEstimateDetails(convertedEstimate);
      
      // Pre-fill the event details from the estimate
      eventBasicDetailsForm.setValue("title", convertedEstimate.title || "");
      eventBasicDetailsForm.setValue("eventType", convertedEstimate.eventType || "");
      
      // Pre-fill client details
      clientDetailsForm.setValue("clientName", convertedEstimate.client?.name || "");
      clientDetailsForm.setValue("clientEmail", convertedEstimate.client?.email || "");
    }
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  const handleEventBasicDetailsSubmit = (data: any) => {
    setEventBasicDetails(data);
    handleNext();
  };

  const handleClientDetailsSubmit = (data: any) => {
    setClientDetails(data);
    handleNext();
  };

  const handleTeamRequirementsSubmit = async (data: any) => {
    setTeamRequirements(data);
    await handleCreateEvent({
      ...eventBasicDetails,
      client: clientDetails,
      team: data
    });
  };

  const handleCreateEvent = async (eventData: any) => {
    setLoading(true);
    setValidationErrors([]);
    
    try {
      // Check if event already exists
      const eventExists = await checkEventExistence(eventData.title, eventData.eventDate);
      
      if (eventExists) {
        toast({
          title: "Event Already Exists",
          description: "An event with the same title and date already exists.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      const newEvent = {
        ...eventData,
        estimateId: selectedEstimateId,
        status: "scheduled"
      };
      
      await createEvent(newEvent);
      
      toast({
        title: "Event Created",
        description: "Event has been successfully created and scheduled.",
      });
      
      onEventCreated();
      handleClose();
    } catch (error) {
      console.error("Error creating event:", error);
      
      if (error.message && Array.isArray(error.message)) {
        setValidationErrors(error.message);
      } else {
        toast({
          title: "Error",
          description: "Failed to create event. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  return {
    showModal,
    step,
    selectedEstimateId,
    approvedEstimates,
    estimateDetails,
    loading,
    validationErrors,
    eventBasicDetailsForm,
    clientDetailsForm,
    teamRequirementsForm,
    loadEstimates,
    handleEstimateSelection,
    handleNext,
    handlePrevious,
    handleEventBasicDetailsSubmit,
    handleClientDetailsSubmit,
    handleTeamRequirementsSubmit,
    handleClose
  };
}
