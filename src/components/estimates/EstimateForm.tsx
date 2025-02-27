
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { WelcomePage } from "./pages/WelcomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { EstimateDetailsPage } from "./pages/EstimateDetailsPage";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { EstimateDetails } from "./preview/EstimateDetails";
import { Email, Share2 } from "lucide-react";
import { EmailForm } from "./preview/EmailForm";
import { WhatsAppForm } from "./preview/WhatsAppForm";

interface EstimateFormProps {
  open: boolean;
  onClose: () => void;
}

export function EstimateForm({ open, onClose }: EstimateFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    selectedServices: [],
    estimateDetails: {
      events: [],
      estimates: [],
      deliverables: []
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewEstimate, setPreviewEstimate] = useState(null);

  const generatePreviewEstimate = () => {
    // Get the first estimate for preview (typically there's just one)
    const firstEstimate = formData.estimateDetails.estimates[0];
    
    if (!firstEstimate) {
      toast({
        title: "Missing Information",
        description: "Please add at least one estimate option with services.",
        variant: "destructive",
      });
      return null;
    }
    
    const previewData = {
      id: Math.floor(Math.random() * 10000).toString(),
      clientName: formData.clientName,
      date: new Date().toISOString(),
      amount: firstEstimate.total,
      status: "pending",
      services: firstEstimate.services.map(service => ({
        event: service.event,
        date: service.date,
        photographers: service.photographers,
        cinematographers: service.cinematographers
      })),
      deliverables: firstEstimate.deliverables
    };
    
    return previewData;
  };

  const handleGeneratePreview = () => {
    const preview = generatePreviewEstimate();
    if (preview) {
      setPreviewEstimate(preview);
      setCurrentPage(3); // Move to preview page
    }
  };

  const handleSubmit = async () => {
    if (!previewEstimate) {
      handleGeneratePreview();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Log the form data to console for debugging
      console.log("Submitting estimate:", previewEstimate);
      
      // Simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Estimate Created",
        description: `Estimate for ${formData.clientName} has been created successfully.`,
      });
      
      // Close the dialog
      onClose();
      
      // Reset form data
      setFormData({
        clientName: "",
        selectedServices: [],
        estimateDetails: {
          events: [],
          estimates: [],
          deliverables: []
        }
      });
      setPreviewEstimate(null);
      
      // Reset to first page for next time
      setCurrentPage(0);
      
      // Redirect to pre-production page to continue the workflow
      navigate("/pre-production");
    } catch (error) {
      console.error("Error creating estimate:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your estimate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pages = [
    <WelcomePage 
      key="welcome" 
      clientName={formData.clientName}
      onClientNameChange={(name) => 
        setFormData(prev => ({ ...prev, clientName: name }))
      }
    />,
    <ServicesPage 
      key="services"
      selectedServices={formData.selectedServices}
      onServicesChange={(services) =>
        setFormData(prev => ({ ...prev, selectedServices: services }))
      }
    />,
    <EstimateDetailsPage 
      key="details"
      estimateDetails={formData.estimateDetails}
      onDetailsChange={(details) =>
        setFormData(prev => ({ ...prev, estimateDetails: details }))
      }
    />
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentPage === 3 ? "Preview Estimate" : "Create New Estimate"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {currentPage < 3 && pages[currentPage]}
          
          {currentPage === 3 && previewEstimate && (
            <div className="space-y-6">
              {showEmailForm && (
                <EmailForm 
                  onClose={() => setShowEmailForm(false)} 
                  estimate={previewEstimate} 
                />
              )}
              
              {showWhatsAppForm && (
                <WhatsAppForm 
                  onClose={() => setShowWhatsAppForm(false)} 
                  estimate={previewEstimate}
                />
              )}
              
              {!showEmailForm && !showWhatsAppForm && (
                <div className="flex justify-center space-x-4 mb-4">
                  <Button onClick={() => setShowEmailForm(true)} variant="outline">
                    <Email className="mr-2 h-4 w-4" />
                    Send via Email
                  </Button>
                  <Button onClick={() => setShowWhatsAppForm(true)} variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share via WhatsApp
                  </Button>
                </div>
              )}
              
              <EstimateDetails estimate={previewEstimate} />
            </div>
          )}
          
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                if (currentPage === 3) {
                  setShowEmailForm(false);
                  setShowWhatsAppForm(false);
                }
                setCurrentPage(prev => prev - 1);
              }}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentPage === 2) {
                  handleGeneratePreview();
                } else if (currentPage === 3) {
                  handleSubmit();
                } else {
                  setCurrentPage(prev => prev + 1);
                }
              }}
              disabled={isSubmitting}
            >
              {currentPage === 2 
                ? "Preview Estimate"
                : currentPage === 3
                ? (isSubmitting ? "Creating..." : "Create Estimate")
                : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
