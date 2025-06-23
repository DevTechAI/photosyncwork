import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";
import { DeliverablesContainer } from "./deliverables/DeliverablesContainer";
import { AssignDeliverableModal } from "./deliverables/AssignDeliverableModal";
import { RevisionRequestModal } from "./deliverables/RevisionRequestModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PostProductionDeliverablesProps {
  selectedEvent: ScheduledEvent;
  setSelectedEvent: (event: ScheduledEvent) => void;
  updateEvents: (updatedEvent: ScheduledEvent) => void;
  teamMembers: TeamMember[];
}

export function PostProductionDeliverables({ 
  selectedEvent, 
  setSelectedEvent, 
  updateEvents,
  teamMembers 
}: PostProductionDeliverablesProps) {
  const { toast } = useToast();
  
  const [isAssignDeliverableModalOpen, setIsAssignDeliverableModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  
  const uploadFileToS3 = async (file: File): Promise<string> => {
    try {
      // Convert file to base64
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64String = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
      
      console.log('Uploading file to S3:', file.name, 'Size:', file.size);
      
      const { data, error } = await supabase.functions.invoke('upload-to-s3', {
        body: {
          fileName: file.name,
          contentBase64: base64String,
          contentType: file.type,
          folder: 'deliverables'
        }
      });

      if (error) {
        console.error('S3 upload error:', error);
        throw new Error('Failed to upload file to S3');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'S3 upload failed');
      }

      console.log('File uploaded successfully:', data.url);
      return data.url;
    } catch (error) {
      console.error('Error in uploadFileToS3:', error);
      throw error;
    }
  };

  const saveToClientDeliverables = async (file: File, fileUrl: string, eventId: string) => {
    try {
      console.log('Saving file metadata to database:', file.name);
      
      const { data, error } = await supabase
        .from('client_deliverables')
        .insert({
          event_id: eventId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_url: fileUrl,
          is_watermarked: true,
          is_approved: false,
          download_count: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Database save error:', error);
        throw new Error('Failed to save file metadata to database');
      }

      console.log('File metadata saved successfully:', data.id);
      return data;
    } catch (error) {
      console.error('Error in saveToClientDeliverables:', error);
      throw error;
    }
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload started');
    
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    // Prevent form submission or page reload
    event.preventDefault();
    
    setUploadingFiles(true);
    
    try {
      console.log(`Processing ${files.length} files`);
      
      const uploadPromises = Array.from(files).map(async (file, index) => {
        try {
          console.log(`Processing file ${index + 1}:`, file.name);
          
          // Validate file
          if (!file.type) {
            throw new Error(`File ${file.name} has no type`);
          }
          
          if (file.size === 0) {
            throw new Error(`File ${file.name} is empty`);
          }
          
          if (file.size > 100 * 1024 * 1024) { // 100MB limit
            throw new Error(`File ${file.name} is too large (max 100MB)`);
          }
          
          // Upload to S3
          const fileUrl = await uploadFileToS3(file);
          
          // Save to client_deliverables table
          const deliverableRecord = await saveToClientDeliverables(file, fileUrl, selectedEvent.id);
          
          // Create deliverable entry for the event
          return {
            id: `del_${Date.now()}_${index}`,
            type: file.type.startsWith('image/') ? "photos" as const : 
                  file.type.startsWith('video/') ? "videos" as const : "album" as const,
            status: "pending" as const,
            assignedTo: undefined,
            deliveryDate: undefined,
            revisionNotes: undefined,
            completedDate: undefined,
            fileUrl: fileUrl,
            fileName: file.name,
            fileSize: file.size,
            clientDeliverableId: deliverableRecord.id
          };
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          throw new Error(`Failed to upload ${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
        }
      });

      console.log('Waiting for all uploads to complete...');
      const newDeliverables = await Promise.all(uploadPromises);

      const updatedEvent = {
        ...selectedEvent,
        deliverables: [...(selectedEvent.deliverables || []), ...newDeliverables]
      };

      updateEvents(updatedEvent);
      setSelectedEvent(updatedEvent);
      
      console.log('Upload completed successfully');
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) have been uploaded and are now available in the client gallery.`
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was an error uploading the files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingFiles(false);
      // Reset the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleAddDeliverable = () => {
    const newDeliverable = {
      id: `del_${Date.now()}`,
      type: "photos" as const,
      status: "pending" as const,
      assignedTo: undefined,
      deliveryDate: undefined,
      revisionNotes: undefined,
      completedDate: undefined
    };

    const updatedEvent = {
      ...selectedEvent,
      deliverables: [...(selectedEvent.deliverables || []), newDeliverable]
    };

    updateEvents(updatedEvent);
    setSelectedEvent(updatedEvent);
    
    toast({
      title: "Deliverable Added",
      description: "A new deliverable has been created."
    });
  };
  
  const handleOpenAssignModal = (deliverableId: string) => {
    setSelectedDeliverableId(deliverableId);
    setIsAssignDeliverableModalOpen(true);
  };
  
  const handleAssignDeliverable = (teamMemberId: string, deliveryDate: string) => {
    if (!selectedEvent || !selectedDeliverableId) return;
    
    // Update the deliverable
    const updatedEvent = {
      ...selectedEvent,
      deliverables: selectedEvent.deliverables?.map(deliverable => 
        deliverable.id === selectedDeliverableId
          ? { 
              ...deliverable, 
              assignedTo: teamMemberId,
              deliveryDate,
              status: "in-progress" as const
            }
          : deliverable
      )
    };
    
    // Update events state
    updateEvents(updatedEvent);
    setSelectedEvent(updatedEvent);
    setIsAssignDeliverableModalOpen(false);
    
    toast({
      title: "Deliverable Assigned",
      description: "The deliverable has been assigned and is now in progress."
    });
  };
  
  const handleUpdateDeliverableStatus = (deliverableId: string, status: "pending" | "in-progress" | "delivered" | "revision-requested" | "completed") => {
    if (!selectedEvent) return;
    
    // Update the deliverable status
    const updatedEvent = {
      ...selectedEvent,
      deliverables: selectedEvent.deliverables?.map(deliverable => 
        deliverable.id === deliverableId
          ? { 
              ...deliverable, 
              status,
              completedDate: status === "completed" ? new Date().toISOString().split('T')[0] : deliverable.completedDate
            }
          : deliverable
      )
    };
    
    // Update events state
    updateEvents(updatedEvent);
    setSelectedEvent(updatedEvent);
    
    toast({
      title: "Status Updated",
      description: `Deliverable status has been updated to ${status.replace("-", " ")}.`
    });
  };
  
  const handleOpenRevisionModal = (deliverableId: string) => {
    setSelectedDeliverableId(deliverableId);
    setIsRevisionModalOpen(true);
  };
  
  const handleRequestRevision = (revisionNotes: string) => {
    if (!selectedEvent || !selectedDeliverableId) return;
    
    // Update the deliverable
    const updatedEvent = {
      ...selectedEvent,
      deliverables: selectedEvent.deliverables?.map(deliverable => 
        deliverable.id === selectedDeliverableId
          ? { 
              ...deliverable, 
              status: "revision-requested" as const,
              revisionNotes
            }
          : deliverable
      )
    };
    
    // Update events state
    updateEvents(updatedEvent);
    setSelectedEvent(updatedEvent);
    setIsRevisionModalOpen(false);
    
    toast({
      title: "Revision Requested",
      description: "A revision has been requested for the deliverable."
    });
  };
  
  const handleCompleteAllDeliverables = () => {
    if (!selectedEvent) return;
    
    // Check if all deliverables are completed
    const allCompleted = selectedEvent.deliverables?.every(d => d.status === "completed");
    
    if (!allCompleted) {
      toast({
        title: "Cannot Complete Event",
        description: "All deliverables must be completed before moving the event to completed status.",
        variant: "destructive"
      });
      return;
    }
    
    // Update event stage to completed
    const updatedEvent = {
      ...selectedEvent,
      stage: "completed" as const
    };
    
    // Update events state - this will remove it from the post-production list
    updateEvents(updatedEvent);
    
    // Since we're completing this event, we should clear the selected event
    setSelectedEvent(null);
    
    toast({
      title: "Event Completed",
      description: "All deliverables are completed and the event has been marked as completed."
    });
  };
  
  // Check if all deliverables are assigned
  const areAllDeliverablesAssigned = selectedEvent?.deliverables?.every(d => d.assignedTo);
  
  // Check if the event is ready for completion
  const isReadyForCompletion = selectedEvent?.deliverables?.every(d => d.status === "completed");
  
  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <h3 className="text-lg font-medium">Upload Client Deliverables</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Upload photos, videos, or documents that will be delivered to the client
            </p>
          </div>
          <div className="mt-6 flex gap-4 justify-center">
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
              disabled={uploadingFiles}
              className="hidden"
              id="deliverable-upload"
              accept="image/*,video/*,.pdf,.doc,.docx"
            />
            <Button
              type="button"
              onClick={() => document.getElementById('deliverable-upload')?.click()}
              disabled={uploadingFiles}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadingFiles ? "Uploading..." : "Upload Files"}
            </Button>
            <Button
              variant="outline"
              onClick={handleAddDeliverable}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Deliverable
            </Button>
          </div>
        </div>
      </div>

      {/* Deliverables Container */}
      <DeliverablesContainer 
        selectedEvent={selectedEvent}
        teamMembers={teamMembers}
        onUpdateDeliverableStatus={handleUpdateDeliverableStatus}
        onOpenAssignModal={handleOpenAssignModal}
        onOpenRevisionModal={handleOpenRevisionModal}
        onCompleteAllDeliverables={handleCompleteAllDeliverables}
        areAllDeliverablesAssigned={areAllDeliverablesAssigned}
        isReadyForCompletion={isReadyForCompletion}
      />

      <AssignDeliverableModal 
        isOpen={isAssignDeliverableModalOpen}
        onClose={() => setIsAssignDeliverableModalOpen(false)}
        selectedEvent={selectedEvent}
        selectedDeliverableId={selectedDeliverableId}
        teamMembers={teamMembers}
        onAssign={handleAssignDeliverable}
      />
      
      <RevisionRequestModal 
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onRequestRevision={handleRequestRevision}
      />
    </div>
  );
}
