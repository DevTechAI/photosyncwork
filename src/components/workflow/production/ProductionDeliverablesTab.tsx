
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Eye, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { ScheduledEvent } from "@/components/scheduling/types";
import { useToast } from "@/components/ui/use-toast";

interface Deliverable {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  status: "pending" | "approved" | "revision_requested";
  downloadCount: number;
  clientNotes?: string;
}

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
  
  // Get deliverables from event data (mock for now)
  const deliverables: Deliverable[] = selectedEvent.deliverables || [];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    
    try {
      // Mock file upload - in real implementation, upload to S3/Supabase Storage
      const newDeliverables = Array.from(files).map((file, index) => ({
        id: `del_${Date.now()}_${index}`,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        status: "pending" as const,
        downloadCount: 0
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

  const handleDeleteDeliverable = (deliverableId: string) => {
    const updatedDeliverables = deliverables.filter(d => d.id !== deliverableId);
    const updatedEvent = {
      ...selectedEvent,
      deliverables: updatedDeliverables
    };
    
    onUpdateEvent(updatedEvent);
    
    toast({
      title: "Deliverable deleted",
      description: "The file has been removed from client deliverables."
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "revision_requested":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <Eye className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "revision_requested":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                      {deliverable.fileName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(deliverable.fileSize)} • 
                      Uploaded {new Date(deliverable.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(deliverable.status)}>
                    {deliverable.status.replace('_', ' ')}
                  </Badge>
                  
                  {deliverable.downloadCount > 0 && (
                    <Badge variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      {deliverable.downloadCount}
                    </Badge>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDeliverable(deliverable.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {deliverable.clientNotes && (
                <div className="mt-3 p-2 bg-muted rounded text-sm">
                  <strong>Client feedback:</strong> {deliverable.clientNotes}
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
