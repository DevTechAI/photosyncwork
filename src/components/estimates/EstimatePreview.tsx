
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusChecker } from "./preview/StatusChecker";
import { HeaderActions } from "./preview/HeaderActions";
import { useEstimatePreview } from "@/hooks/estimates/useEstimatePreview";
import { PreviewContent } from "./preview/PreviewContent";
import { PreviewPagination } from "./preview/PreviewPagination";
import { ScheduleButton } from "./preview/ScheduleButton";
import { PreviewFormDisplay } from "./preview/PreviewFormDisplay";

interface EstimatePreviewProps {
  open: boolean;
  onClose: () => void;
  estimate: {
    id: string;
    clientName: string;
    clientEmail?: string;
    date: string;
    amount: string;
    status: string;
    selectedServices?: string[];
    selectedPackageIndex?: number;
    services?: Array<{
      event: string;
      date: string;
      photographers: string;
      cinematographers: string;
    }>;
    deliverables?: string[];
    packages?: Array<{
      name?: string;
      amount: string;
      services: Array<{
        event: string;
        date: string;
        photographers: string;
        cinematographers: string;
      }>;
      deliverables: string[];
    }>;
    terms?: string[];
  };
  onStatusChange?: (estimateId: string, newStatus: string, negotiatedAmount?: string, selectedPackageIndex?: number) => void;
}

export function EstimatePreview({ open, onClose, estimate, onStatusChange }: EstimatePreviewProps) {
  const {
    showEmailForm,
    showWhatsAppForm,
    showApprovalForm,
    currentPageIndex,
    setShowEmailForm,
    setShowWhatsAppForm,
    setShowApprovalForm,
    setCurrentPageIndex,
    handleStatusChange,
    handleGoToScheduling
  } = useEstimatePreview(estimate, onStatusChange, onClose);

  // Check if the estimate has multiple packages or if a specific package is selected
  const hasMultiplePackages = estimate.packages && estimate.packages.length > 1;
  const selectedPackage = estimate.selectedPackageIndex !== undefined && 
    estimate.packages && 
    estimate.packages[estimate.selectedPackageIndex];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Estimate Preview</DialogTitle>
          {hasMultiplePackages && selectedPackage && (
            <div className="text-sm text-muted-foreground">
              Selected Package: <span className="font-medium">{selectedPackage.name || `Option ${estimate.selectedPackageIndex! + 1}`}</span>
            </div>
          )}
          <HeaderActions 
            onShowEmailForm={() => setShowEmailForm(true)}
            onShowWhatsAppForm={() => setShowWhatsAppForm(true)}
            onShowApprovalForm={() => setShowApprovalForm(true)}
            isApproved={estimate.status === "approved"}
          />
        </DialogHeader>

        <StatusChecker 
          isActive={showEmailForm} 
          estimate={estimate} 
          onStatusChange={handleStatusChange} 
        />

        <PreviewFormDisplay 
          showEmailForm={showEmailForm}
          showWhatsAppForm={showWhatsAppForm}
          showApprovalForm={showApprovalForm}
          onCloseEmailForm={() => setShowEmailForm(false)}
          onCloseWhatsAppForm={() => setShowWhatsAppForm(false)}
          onCloseApprovalForm={() => setShowApprovalForm(false)}
          estimate={estimate}
          onStatusChange={handleStatusChange}
        />

        {!showEmailForm && !showWhatsAppForm && !showApprovalForm && (
          <>
            <PreviewContent 
              currentPageIndex={currentPageIndex} 
              estimate={estimate} 
            />
            
            <PreviewPagination 
              currentPageIndex={currentPageIndex}
              setCurrentPageIndex={setCurrentPageIndex}
            />
            
            <ScheduleButton 
              isApproved={estimate.status === "approved"}
              onSchedule={handleGoToScheduling}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
