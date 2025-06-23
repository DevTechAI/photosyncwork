import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Eye, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Use the deliverable type from ScheduledEvent instead of creating a separate one
type Deliverable = NonNullable<ScheduledEvent['deliverables']>[0];

interface ProductionDeliverablesTabProps {
  selectedEvent: ScheduledEvent;
  onUpdateEvent: (event: ScheduledEvent) => void;
}

export function ProductionDeliverablesTab({ 
  selectedEvent, 
  onUpdateEvent 
}: ProductionDeliverablesTabProps) {
  const { toast } = useToast();
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  
  // Get deliverables from event data, ensuring they match the ScheduledEvent type
  const deliverables: Deliverable[] = selectedEvent.deliverables || [];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    
    try {
      // Create new deliverables that match the ScheduledEvent deliverable type
      const newDeliverables: Deliverable[] = Array.from(files).map((file, index) => ({
        id: `del_${Date.now()}_${index}`,
        type: file.type.startsWith('image/') ? "photos" as const : 
              file.type.startsWith('video/') ? "videos" as const : "album" as const,
        status: "pending" as const,
        assignedTo: undefined,
        deliveryDate: undefined,
        revisionNotes: undefined,
        completedDate: undefined
      }));

      const updatedEvent = {
        ...selectedEvent,
        deliverables: [...deliverables, ...newDeliverables]
      };

      onUpdateEvent(updatedEvent);
      
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) have been uploaded for client review.`
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleDeleteDeliverable = async (deliverableId: string) => {
    setDeletingFile(deliverableId);
    
    try {
      // Remove the deliverable from the array
      const updatedDeliverables = deliverables.filter(d => d.id !== deliverableId);
      const updatedEvent = {
        ...selectedEvent,
        deliverables: updatedDeliverables
      };
      
      onUpdateEvent(updatedEvent);
      
      toast({
        title: "File deleted successfully",
        description: "The file has been removed from client deliverables."
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeletingFile(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "revision-requested":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <Eye className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "revision-requested":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Client Deliverables</h2>
        <div className="flex gap-2">
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
            onClick={() => document.getElementById('deliverable-upload')?.click()}
            disabled={uploadingFiles}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadingFiles ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      </div>

      {deliverables.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No deliverables uploaded yet</p>
            <p className="text-sm">Upload photos, videos, or documents for client review</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {deliverables.map((deliverable) => (
            <Card key={deliverable.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(deliverable.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">
                      {deliverable.type === "photos" ? "Photo Collection" :
                       deliverable.type === "videos" ? "Video Collection" : "Album"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {deliverable.assignedTo && `Assigned to: ${deliverable.assignedTo}`}
                      {deliverable.deliveryDate && ` • Due: ${deliverable.deliveryDate}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(deliverable.status)}>
                    {deliverable.status.replace('-', ' ')}
                  </Badge>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingFile === deliverable.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete File</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this file? This action cannot be undone and will remove the file from client access.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteDeliverable(deliverable.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete File
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              
              {deliverable.revisionNotes && (
                <div className="mt-3 p-2 bg-muted rounded text-sm">
                  <strong>Revision Notes:</strong> {deliverable.revisionNotes}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        <p>• Files uploaded here will be available for client download in their portal</p>
        <p>• Clients can provide feedback and request revisions</p>
        <p>• Supported formats: Images, Videos, PDF, Word documents</p>
      </div>
    </div>
  );
}
