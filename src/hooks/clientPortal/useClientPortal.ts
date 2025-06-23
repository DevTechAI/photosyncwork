
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClientPortalData, ClientDeliverable, ClientFeedback } from "@/types/clientPortal";

export function useClientPortal(accessCode: string) {
  const [portalData, setPortalData] = useState<ClientPortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (accessCode) {
      fetchPortalData();
    }
  }, [accessCode]);

  const fetchPortalData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Verify access code
      const { data: accessData, error: accessError } = await supabase
        .from('client_portal_access')
        .select('*')
        .eq('access_code', accessCode)
        .eq('is_active', true)
        .single();

      if (accessError || !accessData) {
        throw new Error('Invalid access code');
      }

      // Check if access has expired
      if (accessData.expires_at && new Date(accessData.expires_at) < new Date()) {
        throw new Error('Access code has expired');
      }

      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('scheduled_events')
        .select('*')
        .eq('id', accessData.event_id)
        .single();

      if (eventError || !eventData) {
        throw new Error('Event not found');
      }

      // Fetch deliverables
      const { data: deliverables, error: deliverablesError } = await supabase
        .from('client_deliverables')
        .select('*')
        .eq('event_id', accessData.event_id)
        .order('created_at', { ascending: false });

      if (deliverablesError) {
        console.error('Error fetching deliverables:', deliverablesError);
      }

      // Fetch feedback
      const { data: feedback, error: feedbackError } = await supabase
        .from('client_feedback')
        .select('*')
        .eq('event_id', accessData.event_id)
        .order('created_at', { ascending: false });

      if (feedbackError) {
        console.error('Error fetching feedback:', feedbackError);
      }

      // Format the data
      const formattedDeliverables: ClientDeliverable[] = (deliverables || []).map(d => ({
        id: d.id,
        fileName: d.file_name,
        fileType: d.file_type,
        fileSize: d.file_size,
        fileUrl: d.file_url,
        isWatermarked: d.is_watermarked,
        isApproved: d.is_approved,
        downloadCount: d.download_count,
        createdAt: d.created_at
      }));

      const formattedFeedback: ClientFeedback[] = (feedback || []).map(f => ({
        id: f.id,
        deliverableId: f.deliverable_id,
        status: f.status as 'approved' | 'revision_requested' | 'pending',
        feedbackText: f.feedback_text,
        createdAt: f.created_at
      }));

      const portalData: ClientPortalData = {
        access: {
          clientName: accessData.client_name,
          clientEmail: accessData.client_email,
          eventId: accessData.event_id
        },
        eventDetails: {
          name: eventData.name,
          date: eventData.date,
          location: eventData.location,
          clientName: eventData.clientname
        },
        deliverables: formattedDeliverables,
        feedback: formattedFeedback
      };

      setPortalData(portalData);
    } catch (err) {
      console.error('Error fetching portal data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load portal data');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (
    deliverableId: string | undefined,
    feedbackText: string,
    status: 'approved' | 'revision_requested'
  ) => {
    if (!portalData) return;

    try {
      const { error } = await supabase
        .from('client_feedback')
        .insert({
          event_id: portalData.access.eventId,
          deliverable_id: deliverableId || null,
          feedback_text: feedbackText,
          status
        });

      if (error) throw error;

      // Update deliverable status if applicable
      if (deliverableId && status === 'approved') {
        await supabase
          .from('client_deliverables')
          .update({ is_approved: true })
          .eq('id', deliverableId);
      }

      toast({
        title: "Feedback submitted",
        description: `Your feedback has been ${status === 'approved' ? 'approved' : 'submitted for revision'}.`
      });

      // Refresh data
      await fetchPortalData();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadFile = async (deliverable: ClientDeliverable) => {
    try {
      // Increment download count
      await supabase
        .from('client_deliverables')
        .update({ download_count: deliverable.downloadCount + 1 })
        .eq('id', deliverable.id);

      // Create download link
      const link = document.createElement('a');
      link.href = deliverable.fileUrl;
      link.download = deliverable.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download started",
        description: `Downloading ${deliverable.fileName}`
      });

      // Refresh data to update download count
      await fetchPortalData();
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download failed",
        description: "Failed to download file. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    portalData,
    loading,
    error,
    submitFeedback,
    downloadFile
  };
}
