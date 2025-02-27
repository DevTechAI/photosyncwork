import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
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
  editingEstimate?: any;
}

export function EstimateForm({ open, onClose, editingEstimate }: EstimateFormProps) {
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

  useEffect(() => {
    if (editingEstimate) {
      const selectedServices = editingEstimate.services?.map(service => service.event) || [];
      
      let estimates = [];
      if (editingEstimate.packages && editingEstimate.packages.length > 0) {
        estimates = editingEstimate.packages.map(pkg => ({
          services: pkg.services || [],
          deliverables: pkg.deliverables || [],
          total: pkg.amount
        }));
      } else {
        estimates = [{
          services: editingEstimate.services || [],
          deliverables: editingEstimate.deliverables || [],
          total: editingEstimate.amount
        }];
      }
      
      setFormData({
        clientName: editingEstimate.clientName || "",
        selectedServices,
        estimateDetails: {
          events: [],
          estimates,
          deliverables: []
        }
      });
      
      setPreviewEstimate(editingEstimate);
    }
  }, [editingEstimate]);

  const handleGeneratePreview = () => {
    const preview = generatePreviewEstimate(formData, toast);
    if (preview) {
      if (editingEstimate) {
        preview.id = editingEstimate.id;
        preview.status = editingEstimate.status;
        preview.clientEmail = editingEstimate.clientEmail;
      }
      
      setPreviewEstimate(preview);
      setCurrentPage(3);
    }
  };

  const handleSaveEstimate = async () => {
    if (!previewEstimate) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Saving estimate:", previewEstimate);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const savedEstimates = localStorage.getItem("estimates");
      let estimates = savedEstimates ? JSON.parse(savedEstimates) : [];
      
      if (editingEstimate) {
        estimates = estimates.map(est => 
          est.id === previewEstimate.id ? previewEstimate : est
        );
        
        toast({
          title: "Estimate Updated",
          description: `Estimate for ${formData.clientName} has been updated successfully.`,
        });
      } else {
        estimates.unshift(previewEstimate);
        
        toast({
          title: "Estimate Created",
          description: `Estimate for ${formData.clientName} has been created successfully.`,
        });
      }
      
      localStorage.setItem("estimates", JSON.stringify(estimates));
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving estimate:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your estimate. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAndReset = () => {
    if (!editingEstimate) {
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
    }
    
    setCurrentPage(0);
    onClose();
  };

  const handlePrevious = () => {
    setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage === 2) {
      handleGeneratePreview();
    } else if (currentPage === 3) {
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
            {editingEstimate ? "Edit Estimate" : currentPage === 3 ? "Preview Estimate" : "Create New Estimate"}
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
