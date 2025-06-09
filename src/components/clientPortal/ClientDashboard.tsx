import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ClientPortalData, ClientDeliverable } from "@/types/clientPortal";
import { Download, MessageSquare, Calendar, MapPin, FileText, Image, Video, ThumbsUp, ThumbsDown, GalleryHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ClientDashboardProps {
  portalData: ClientPortalData;
  onSubmitFeedback: (deliverableId: string | undefined, feedbackText: string, status: 'approved' | 'revision_requested') => void;
  onDownloadFile: (deliverable: ClientDeliverable) => void;
  onLogout: () => void;
}

export function ClientDashboard({ portalData, onSubmitFeedback, onDownloadFile, onLogout }: ClientDashboardProps) {
  const navigate = useNavigate();
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedDeliverable, setSelectedDeliverable] = useState<string | undefined>();
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  const handleFeedbackSubmit = (status: 'approved' | 'revision_requested') => {
    onSubmitFeedback(selectedDeliverable, feedbackText, status);
    setFeedbackText("");
    setShowFeedbackDialog(false);
    setSelectedDeliverable(undefined);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {portalData.access.clientName}</h1>
            {portalData.eventDetails && (
              <p className="text-muted-foreground">
                {portalData.eventDetails.name} • {portalData.eventDetails.date}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/gallery')}
              className="flex items-center gap-2"
            >
              <GalleryHorizontal className="h-4 w-4" />
              Gallery
            </Button>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Project Overview */}
        {portalData.eventDetails && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Event</Label>
                  <p className="font-medium">{portalData.eventDetails.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                  <p className="font-medium">{portalData.eventDetails.date}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {portalData.eventDetails.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="deliverables" className="space-y-4">
          <TabsList>
            <TabsTrigger value="deliverables">
              Deliverables ({portalData.deliverables.length})
            </TabsTrigger>
            <TabsTrigger value="feedback">
              Feedback ({portalData.feedback.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deliverables" className="space-y-4">
            {portalData.deliverables.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No deliverables available yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your photographer will upload files here when they're ready.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {portalData.deliverables.map((deliverable) => (
                  <Card key={deliverable.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFileIcon(deliverable.fileType)}
                          <span className="font-medium text-sm">{deliverable.fileName}</span>
                        </div>
                        {deliverable.isWatermarked && (
                          <Badge variant="secondary" className="text-xs">Preview</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Size: {formatFileSize(deliverable.fileSize)}</p>
                        <p>Downloads: {deliverable.downloadCount}</p>
                        <p>Added: {formatDistanceToNow(new Date(deliverable.createdAt), { addSuffix: true })}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => onDownloadFile(deliverable)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        
                        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedDeliverable(deliverable.id)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Provide Feedback</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="feedback">Your feedback (optional)</Label>
                                <Textarea
                                  id="feedback"
                                  placeholder="Share your thoughts about this deliverable..."
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleFeedbackSubmit('approved')}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button 
                                  onClick={() => handleFeedbackSubmit('revision_requested')}
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Request Changes
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            {portalData.feedback.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No feedback submitted yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {portalData.feedback.map((feedback) => (
                  <Card key={feedback.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {feedback.deliverableId ? 'File Feedback' : 'General Feedback'}
                        </CardTitle>
                        <Badge variant={
                          feedback.status === 'approved' ? 'default' :
                          feedback.status === 'revision_requested' ? 'destructive' : 'secondary'
                        }>
                          {feedback.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardDescription>
                        {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
                      </CardDescription>
                    </CardHeader>
                    {feedback.feedbackText && (
                      <CardContent>
                        <p className="text-sm">{feedback.feedbackText}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
