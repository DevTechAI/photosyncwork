
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ClientPortalData, ClientDeliverable } from "@/types/clientPortal";
import { Download, Share, Calendar, MapPin, Heart, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ClientDashboardProps {
  portalData: ClientPortalData;
  onSubmitFeedback: (deliverableId: string | undefined, feedbackText: string, status: 'approved' | 'revision_requested') => void;
  onDownloadFile: (deliverable: ClientDeliverable) => void;
  onLogout: () => void;
}

export function ClientDashboard({ portalData, onSubmitFeedback, onDownloadFile, onLogout }: ClientDashboardProps) {
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedDeliverable, setSelectedDeliverable] = useState<string | undefined>();
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleFeedbackSubmit = (status: 'approved' | 'revision_requested') => {
    onSubmitFeedback(selectedDeliverable, feedbackText, status);
    setFeedbackText("");
    setShowFeedbackDialog(false);
    setSelectedDeliverable(undefined);
  };

  const toggleFavorite = (deliverableId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(deliverableId)) {
      newFavorites.delete(deliverableId);
    } else {
      newFavorites.add(deliverableId);
    }
    setFavorites(newFavorites);
  };

  const handleShare = (deliverable: ClientDeliverable) => {
    if (navigator.share) {
      navigator.share({
        title: deliverable.fileName,
        url: deliverable.fileUrl,
      });
    } else {
      navigator.clipboard.writeText(deliverable.fileUrl);
    }
  };

  const isImage = (fileType: string) => fileType.startsWith('image/');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {portalData.access.clientName}</h1>
          {portalData.eventDetails && (
            <p className="text-muted-foreground">
              {portalData.eventDetails.name} • {portalData.eventDetails.date}
            </p>
          )}
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

        <Tabs defaultValue="gallery" className="space-y-4">
          <TabsList>
            <TabsTrigger value="gallery">
              Gallery ({portalData.deliverables.length})
            </TabsTrigger>
            <TabsTrigger value="feedback">
              Feedback ({portalData.feedback.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-4">
            {portalData.deliverables.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No images available yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your photographer will upload files here when they're ready.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {portalData.deliverables.filter(d => isImage(d.fileType)).map((deliverable) => (
                  <div key={deliverable.id} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={deliverable.fileUrl}
                        alt={deliverable.fileName}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleFavorite(deliverable.id)}
                          >
                            <Heart 
                              className={`h-4 w-4 ${favorites.has(deliverable.id) ? 'fill-red-500 text-red-500' : ''}`} 
                            />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={() => onDownloadFile(deliverable)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={() => handleShare(deliverable)}
                          >
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Watermark indicator */}
                      {deliverable.isWatermarked && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs bg-white/90">Preview</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Feedback button at bottom */}
            {portalData.deliverables.length > 0 && (
              <div className="flex justify-center mt-8">
                <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Provide Overall Feedback
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
                          placeholder="Share your thoughts about the photos..."
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
                          Approve All
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
