
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmailForm } from "./preview/EmailForm";
import { WhatsAppForm } from "./preview/WhatsAppForm";
import { ApprovalForm } from "./preview/ApprovalForm";
import { EstimateDetails } from "./preview/EstimateDetails";
import { HeaderActions } from "./preview/HeaderActions";
import { StatusChecker } from "./preview/StatusChecker";
import { useToast } from "@/components/ui/use-toast";

interface EstimatePreviewProps {
  open: boolean;
  onClose: () => void;
  estimate: {
    id: string;
    clientName: string;
    date: string;
    amount: string;
    status: string;
    services?: Array<{
      event: string;
      date: string;
      photographers: string;
      cinematographers: string;
    }>;
    deliverables?: string[];
  };
  onStatusChange?: (estimateId: string, newStatus: string, negotiatedAmount?: string) => void;
}

export function EstimatePreview({ open, onClose, estimate, onStatusChange }: EstimatePreviewProps) {
  const { toast } = useToast();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [showApprovalForm, setShowApprovalForm] = useState(false);

  const handleStatusChange = (estimateId: string, newStatus: string, negotiatedAmount?: string) => {
    if (onStatusChange) {
      onStatusChange(estimateId, newStatus, negotiatedAmount);
      
      toast({
        title: "Estimate Updated",
        description: `Estimate status changed to ${newStatus}`,
      });
    }
  };

  const hideAllForms = () => {
    setShowEmailForm(false);
    setShowWhatsAppForm(false);
    setShowApprovalForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Estimate Preview</DialogTitle>
          <HeaderActions 
            onShowEmailForm={() => {
              hideAllForms();
              setShowEmailForm(true);
            }}
            onShowWhatsAppForm={() => {
              hideAllForms();
              setShowWhatsAppForm(true);
            }}
            onShowApprovalForm={() => {
              hideAllForms();
              setShowApprovalForm(true);
            }}
            isApproved={estimate.status === "approved"}
          />
        </DialogHeader>

        <StatusChecker 
          isActive={showEmailForm} 
          estimate={estimate} 
          onStatusChange={handleStatusChange} 
        />

        {showEmailForm && (
          <EmailForm 
            onClose={() => setShowEmailForm(false)} 
            estimate={estimate} 
          />
        )}

        {showWhatsAppForm && (
          <WhatsAppForm 
            onClose={() => setShowWhatsAppForm(false)} 
            estimate={estimate}
          />
        )}

        {showApprovalForm && (
          <ApprovalForm 
            onClose={() => setShowApprovalForm(false)} 
            estimate={estimate} 
            onStatusChange={handleStatusChange}
          />
        )}

        <EstimateDetails estimate={estimate} />
      </DialogContent>
    </Dialog>
  );
}
