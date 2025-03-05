
import { EmailForm } from "./EmailForm";
import { WhatsAppForm } from "./WhatsAppForm";
import { ApprovalForm } from "./ApprovalForm";

interface PreviewFormDisplayProps {
  showEmailForm: boolean;
  showWhatsAppForm: boolean;
  showApprovalForm: boolean;
  onCloseEmailForm: () => void;
  onCloseWhatsAppForm: () => void;
  onCloseApprovalForm: () => void;
  estimate: any;
  onStatusChange: (estimateId: string, newStatus: string, negotiatedAmount?: string, selectedPackageIndex?: number) => void;
}

export function PreviewFormDisplay({
  showEmailForm,
  showWhatsAppForm,
  showApprovalForm,
  onCloseEmailForm,
  onCloseWhatsAppForm,
  onCloseApprovalForm,
  estimate,
  onStatusChange
}: PreviewFormDisplayProps) {
  return (
    <>
      {showEmailForm && (
        <EmailForm 
          onClose={onCloseEmailForm} 
          estimate={estimate} 
        />
      )}

      {showWhatsAppForm && (
        <WhatsAppForm 
          onClose={onCloseWhatsAppForm} 
          estimate={estimate}
        />
      )}

      {showApprovalForm && (
        <ApprovalForm 
          onClose={onCloseApprovalForm} 
          estimate={estimate} 
          onStatusChange={onStatusChange}
        />
      )}
    </>
  );
}
