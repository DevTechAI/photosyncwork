
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventBasicDetailsForm } from "./components/EventBasicDetailsForm";
import { ClientDetailsForm } from "./components/ClientDetailsForm";
import { TeamRequirementsForm } from "./components/TeamRequirementsForm";
import { EstimateSelector } from "./components/EstimateSelector";
import { ScheduledEvent } from "./types";
import { getApprovedEstimates } from "./utils/approvedEstimatesLoader";
import { createScheduledEventFromEstimateEvent } from "./utils/eventCreator";

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onCreateEvent: (event: ScheduledEvent) => void;
  initialEstimateId?: string;
}

const eventFormSchema = z.object({
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

export function CreateEventModal({
  open,
  onClose,
  onCreateEvent,
  initialEstimateId
}: CreateEventModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [selectedEstimateId, setSelectedEstimateId] = useState<string | null>(initialEstimateId || null);
  const [approvedEstimates, setApprovedEstimates] = useState<any[]>([]);
  const { toast } = useToast();
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
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
    },
  });
  
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
  
  const onSubmit = (data: z.infer<typeof eventFormSchema>) => {
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
    onClose();
    
    // Show success message
    toast({
      title: "Event Created",
      description: `${data.name} has been created.`,
    });
  };
  
  const handleCreateFromEstimate = async () => {
    if (!selectedEstimateId) return;
    
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
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the information below to create a new event.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="client">Client Details</TabsTrigger>
            <TabsTrigger value="team">Team Requirements</TabsTrigger>
            <TabsTrigger value="estimate">From Estimate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <EventBasicDetailsForm register={register} errors={errors} setValue={setValue} />
          </TabsContent>
          
          <TabsContent value="client" className="space-y-4">
            <ClientDetailsForm register={register} errors={errors} setValue={setValue} />
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <TeamRequirementsForm register={register} errors={errors} setValue={setValue} />
          </TabsContent>
          
          <TabsContent value="estimate" className="space-y-4">
            <EstimateSelector 
              selectedEstimateId={selectedEstimateId || ""}
              approvedEstimates={approvedEstimates}
              onEstimateChange={(id) => setSelectedEstimateId(id)}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {activeTab === "estimate" ? (
            <Button type="button" onClick={handleCreateFromEstimate} disabled={!selectedEstimateId}>
              Create Event
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit(onSubmit)}>
              Create Event
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
