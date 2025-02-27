
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Log the form data to console for debugging
      console.log("Submitting estimate:", formData);
      
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Estimate</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {pages[currentPage]}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentPage === pages.length - 1) {
                  handleSubmit();
                } else {
                  setCurrentPage(prev => prev + 1);
                }
              }}
              disabled={isSubmitting}
            >
              {currentPage === pages.length - 1 
                ? (isSubmitting ? "Creating..." : "Create Estimate") 
                : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
