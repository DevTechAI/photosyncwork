
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ScheduledEvent } from "@/components/scheduling/types";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadSectionProps {
  selectedEvent: ScheduledEvent;
  setSelectedEvent: (event: ScheduledEvent) => void;
  updateEvents: (updatedEvent: ScheduledEvent) => void;
}

export function FileUploadSection({ 
  selectedEvent, 
  setSelectedEvent, 
  updateEvents 
}: FileUploadSectionProps) {
  const { toast } = useToast();
  const [uploadingFiles, setUploadingFiles] = useState(false);
  
  const uploadFileToS3 = async (file: File): Promise<string> => {
    console.log('Starting S3 upload for:', file.name, 'Size:', file.size);
    
    // Validate file first
    if (!file.type) {
      throw new Error(`File ${file.name} has no type`);
    }
    
    if (file.size === 0) {
      throw new Error(`File ${file.name} is empty`);
    }
    
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      throw new Error(`File ${file.name} is too large (max 100MB)`);
    }
    
    try {
      // Convert file to base64 safely
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Use btoa with proper chunking to avoid stack overflow
      let base64String = '';
      const chunkSize = 8192;
      
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.slice(i, i + chunkSize);
        const chunkString = String.fromCharCode.apply(null, Array.from(chunk));
        base64String += chunkString;
      }
      
      const finalBase64 = btoa(base64String);
      
      console.log('File converted to base64, uploading to S3...');
      
      const { data, error } = await supabase.functions.invoke('upload-to-s3', {
        body: {
          fileName: file.name,
          contentBase64: finalBase64,
          contentType: file.type,
          folder: 'deliverables'
        }
      });

      if (error) {
        console.error('S3 upload error:', error);
        throw new Error(`Failed to upload ${file.name}: ${error.message || 'Unknown error'}`);
      }

      if (!data || !data.success) {
        throw new Error(`S3 upload failed for ${file.name}: ${data?.error || 'Unknown error'}`);
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
        throw new Error(`Failed to save ${file.name} metadata: ${error.message}`);
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

    // Prevent any form submission behavior
    event.preventDefault();
    event.stopPropagation();
    
    setUploadingFiles(true);
    
    try {
      console.log(`Processing ${files.length} files`);
      
      const results = [];
      
      // Process files sequentially to avoid overwhelming the system
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Processing file ${i + 1}/${files.length}:`, file.name);
        
        try {
          // Upload to S3
          const fileUrl = await uploadFileToS3(file);
          
          // Save to client_deliverables table
          const deliverableRecord = await saveToClientDeliverables(file, fileUrl, selectedEvent.id);
          
          // Create deliverable entry for the event
          const newDeliverable = {
            id: `del_${Date.now()}_${i}`,
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
          
          results.push(newDeliverable);
          console.log(`Successfully processed file ${i + 1}/${files.length}`);
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          throw new Error(`Failed to upload ${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
        }
      }

      const updatedEvent = {
        ...selectedEvent,
        deliverables: [...(selectedEvent.deliverables || []), ...results]
      };

      updateEvents(updatedEvent);
      setSelectedEvent(updatedEvent);
      
      console.log('All uploads completed successfully');
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

  return (
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
  );
}
