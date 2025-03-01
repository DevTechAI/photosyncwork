
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmailForm } from "./preview/EmailForm";
import { WhatsAppForm } from "./preview/WhatsAppForm";
import { ApprovalForm } from "./preview/ApprovalForm";
import { EstimateDetails } from "./preview/EstimateDetails";
import { HeaderActions } from "./preview/HeaderActions";
import { StatusChecker } from "./preview/StatusChecker";
import { useToast } from "@/components/ui/use-toast";
import { WelcomePage } from "./pages/WelcomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { Button } from "@/components/ui/button";

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
  };
  onStatusChange?: (estimateId: string, newStatus: string, negotiatedAmount?: string) => void;
}

export function EstimatePreview({ open, onClose, estimate, onStatusChange }: EstimatePreviewProps) {
  const { toast } = useToast();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

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

  const selectedServices = estimate?.services?.map(service => service.event) || [];

  const pages = [
    <WelcomePage 
      key="welcome" 
      clientName={estimate.clientName}
      clientEmail={estimate.clientEmail || ""}
      onClientNameChange={() => {}} // No-op function since this is read-only
      onClientEmailChange={() => {}} // No-op function since this is read-only
      isReadOnly={true}
    />,
    <ServicesPage 
      key="services"
      selectedServices={selectedServices}
      onServicesChange={() => {}} // No-op function since this is read-only
      isReadOnly={true}
    />,
    <EstimateDetails estimate={estimate} />
  ];

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

        {!showEmailForm && !showWhatsAppForm && !showApprovalForm && (
          <>
            {pages[currentPageIndex]}
            
            <div className="flex justify-between mt-6">
              <Button
                onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                disabled={currentPageIndex === 0}
                variant="outline"
              >
                Previous
              </Button>
              <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                  <Button
                    key={index}
                    variant={currentPageIndex === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPageIndex(index)}
                    className="px-3 py-1"
                  >
                    {index === 0 ? "Intro" : index === 1 ? "Services" : "Estimate"}
                  </Button>
                ))}
              </div>
              <Button
                onClick={() => setCurrentPageIndex(prev => Math.min(2, prev + 1))}
                disabled={currentPageIndex === 2}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
