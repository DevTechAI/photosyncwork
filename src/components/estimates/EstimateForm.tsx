import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { WelcomePage } from "./pages/WelcomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { EstimateDetailsPage } from "./pages/EstimateDetailsPage";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { PreviewStep } from "./components/PreviewStep";
import { FormNavigation } from "./components/FormNavigation";
import { generatePreviewEstimate } from "./utils/estimateHelpers";

interface EstimateFormProps {
  open: boolean;
  onClose: () => void;
}

export function EstimateForm({ open, onClose }: EstimateFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
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

  const handleGeneratePreview = () => {
    const preview = generatePreviewEstimate(formData, toast);
    if (preview) {
      setPreviewEstimate(preview);
      setCurrentPage(3); // Move to preview page
    }
  };

  const handleSaveEstimate = async () => {
    if (!previewEstimate) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Log the form data to console for debugging
      console.log("Saving estimate:", previewEstimate);
      
      // Simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Estimate Created",
        description: `Estimate for ${formData.clientName} has been created successfully.`,
      });
      
      // Get existing estimates from localStorage
      const savedEstimates = localStorage.getItem("estimates");
      const estimates = savedEstimates ? JSON.parse(savedEstimates) : [];
      
      // Add new estimate to the list
      estimates.unshift(previewEstimate);
      
      // Save updated estimates to localStorage
      localStorage.setItem("estimates", JSON.stringify(estimates));
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error creating estimate:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your estimate. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAndReset = () => {
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
    
    // Close the dialog
    onClose();
  };

  const handlePrevious = () => {
    setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage === 2) {
      handleGeneratePreview();
    } else if (currentPage === 3) {
      // We don't need this anymore as the save happens when sharing
      // keepting it empty
    } else {
      setCurrentPage(prev => prev + 1);
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
    <Dialog open={open} onOpenChange={handleCloseAndReset}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentPage === 3 ? "Preview Estimate" : "Create New Estimate"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {currentPage < 3 && pages[currentPage]}
          
          {currentPage === 3 && previewEstimate && (
            <PreviewStep 
              estimate={previewEstimate} 
              onSave={handleSaveEstimate}
            />
          )}
          
          {(currentPage < 3 || !previewEstimate) && (
            <FormNavigation
              currentPage={currentPage}
              isSubmitting={isSubmitting}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
