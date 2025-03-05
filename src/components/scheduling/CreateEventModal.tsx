
import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventBasicDetailsForm } from "./components/EventBasicDetailsForm";
import { ClientDetailsForm } from "./components/ClientDetailsForm";
import { TeamRequirementsForm } from "./components/TeamRequirementsForm";
import { EstimateSelector } from "./components/EstimateSelector";
import { ScheduledEvent } from "./types";
import { useCreateEventModal, ModalTab } from "@/hooks/scheduling/useCreateEventModal";

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onCreateEvent: (event: ScheduledEvent) => void;
  initialEstimateId?: string;
}

export function CreateEventModal({
  open,
  onClose,
  onCreateEvent,
  initialEstimateId
}: CreateEventModalProps) {
  // Use our custom hook for modal logic
  const {
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
  } = useCreateEventModal(initialEstimateId, onCreateEvent, onClose);
  
  // Load estimates when the component mounts
  useEffect(() => {
    loadEstimates();
  }, []);
  
  // This function handles the tab change and enforces the correct type
  const handleTabChange = (value: string) => {
    setActiveTab(value as ModalTab);
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
        
        <Tabs value={activeTab} onValueChange={handleTabChange}>
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
            <Button type="button" onClick={handleSubmit(handleSubmitForm)}>
              Create Event
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
