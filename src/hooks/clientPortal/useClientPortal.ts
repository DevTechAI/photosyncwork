
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClientPortalData, ClientDeliverable, ClientFeedback, ClientPortalAccess } from "@/types/clientPortal";
import { useToast } from "@/components/ui/use-toast";

export function useClientPortal(accessCode: string) {
  const [portalData, setPortalData] = useState<ClientPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (accessCode) {
      loadPortalData();
    }
  }, [accessCode]);

  const loadPortalData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verify access code
      const { data: accessData, error: accessError } = await supabase
        .from('client_portal_access')
        .select('*')
        .eq('access_code', accessCode)
        .eq('is_active', true)
        .single();

      if (accessError || !accessData) {
        throw new Error('Invalid or expired access code');
      }

      // Check if access has expired
      if (accessData.expires_at && new Date(accessData.expires_at) < new Date()) {
        throw new Error('Access code has expired');
      }

      // Load deliverables
      const { data: deliverables, error: deliverablesError } = await supabase
        .from('client_deliverables')
        .select('*')
        .eq('event_id', accessData.event_id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (deliverablesError) {
        throw deliverablesError;
      }

      // Load feedback
      const { data: feedback, error: feedbackError } = await supabase
        .from('client_feedback')
        .select('*')
        .eq('event_id', accessData.event_id)
        .order('created_at', { ascending: false });

      if (feedbackError) {
        throw feedbackError;
      }

      // Load event details
      const { data: eventData } = await supabase
        .from('scheduled_events')
        .select('name, date, location')
        .eq('id', accessData.event_id)
        .single();

      // Transform database objects to match TypeScript interfaces
      const transformedAccess: ClientPortalAccess = {
        id: accessData.id,
        eventId: accessData.event_id,
        accessCode: accessData.access_code,
        clientName: accessData.client_name,
        clientEmail: accessData.client_email,
        passwordHash: accessData.password_hash,
        expiresAt: accessData.expires_at,
        isActive: accessData.is_active,
        createdAt: accessData.created_at,
        updatedAt: accessData.updated_at
      };

      const transformedDeliverables: ClientDeliverable[] = (deliverables || []).map(d => ({
        id: d.id,
        eventId: d.event_id,
        fileName: d.file_name,
        fileUrl: d.file_url,
        fileType: d.file_type,
        fileSize: d.file_size,
        isApproved: d.is_approved,
        isWatermarked: d.is_watermarked,
        downloadCount: d.download_count,
        createdAt: d.created_at,
        updatedAt: d.updated_at
      }));

      const transformedFeedback: ClientFeedback[] = (feedback || []).map(f => ({
        id: f.id,
        eventId: f.event_id,
        deliverableId: f.deliverable_id,
        feedbackText: f.feedback_text,
        status: f.status as 'pending' | 'approved' | 'revision_requested',
        createdAt: f.created_at,
        updatedAt: f.updated_at
      }));

      setPortalData({
        access: transformedAccess,
        deliverables: transformedDeliverables,
        feedback: transformedFeedback,
        eventDetails: eventData || undefined
      });

    } catch (err: any) {
      console.error('Error loading portal data:', err);
      setError(err.message || 'Failed to load portal data');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (deliverableId: string | undefined, feedbackText: string, status: 'approved' | 'revision_requested') => {
    if (!portalData) return;

    try {
      const { error } = await supabase
        .from('client_feedback')
        .insert({
          event_id: portalData.access.eventId,
          deliverable_id: deliverableId,
          feedback_text: feedbackText,
          status: status
        });

      if (error) throw error;

      toast({
        title: "Feedback submitted",
        description: "Your feedback has been sent to the team."
      });

      // Reload data to show new feedback
      await loadPortalData();

    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadFile = async (deliverable: ClientDeliverable) => {
    try {
      // Update download count
      await supabase
        .from('client_deliverables')
        .update({ download_count: deliverable.downloadCount + 1 })
        .eq('id', deliverable.id);

      // Open file in new tab for download
      window.open(deliverable.fileUrl, '_blank');

      // Reload data to update download count
      await loadPortalData();

    } catch (err: any) {
      console.error('Error downloading file:', err);
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
    downloadFile,
    reload: loadPortalData
  };
}
