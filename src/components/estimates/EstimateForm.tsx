
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormWrapper } from "./form/FormWrapper";
import { EstimateFormPages } from "./form/EstimateFormPages";
import { useEstimateForm } from "./form/hooks/useEstimateForm";
import { useToast } from "@/components/ui/use-toast";

interface EstimateFormProps {
  open: boolean;
  onClose: () => void;
  editingEstimate?: any;
}

export function EstimateForm({ open, onClose, editingEstimate }: EstimateFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentPage,
    formData,
    isSubmitting,
    previewEstimate,
    setCurrentPage,
    handleNextPage,
    handlePreviousPage,
    handleUpdateFormData,
    handleSaveEstimate,
  } = useEstimateForm(editingEstimate);

  const handleCloseAndReset = () => {
    if (!editingEstimate) {
      // Reset form data only when creating a new estimate
      handleUpdateFormData("clientName", "");
      handleUpdateFormData("clientEmail", "");
      handleUpdateFormData("selectedServices", []);
      handleUpdateFormData("estimateDetails", {
        events: [],
        estimates: [],
        deliverables: []
      });
    }
    
    setCurrentPage(editingEstimate ? 2 : 0);
    onClose();
  };

  const validateCurrentStep = () => {
    // Validate depending on the current step
    if (currentPage === 0) {
      if (!formData.clientName.trim()) {
        toast({
          title: "Client name required",
          description: "Please enter the client name to continue.",
          variant: "destructive",
        });
        return false;
      }
      
      // Email validation (if provided)
      const email = formData.clientEmail;
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast({
          title: "Invalid email format",
          description: "Please enter a valid email address or leave it blank.",
          variant: "destructive",
        });
        return false;
      }
    } else if (currentPage === 1 && formData.selectedServices.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one service to continue.",
        variant: "destructive",
      });
      return false;
    } else if (currentPage === 2) {
      // Validate estimate details
      const { estimates } = formData.estimateDetails;
      if (!estimates || estimates.length === 0) {
        toast({
          title: "No estimate packages",
          description: "Please add at least one estimate package to continue.",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if at least one service exists within any estimate
      const hasServices = estimates.some(estimate => 
        estimate.services && estimate.services.length > 0
      );
      
      if (!hasServices) {
        toast({
          title: "Missing services",
          description: "Please add at least one service to an estimate package.",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handleNextWithValidation = () => {
    if (validateCurrentStep()) {
      handleNextPage();
    }
  };

  const getDialogTitle = () => {
    if (editingEstimate) {
      return "Edit Estimate Details";
    }
    return currentPage === 3 ? "Preview Estimate" : "Create New Estimate";
  };

  return (
    <FormWrapper 
      open={open} 
      onClose={handleCloseAndReset}
      title={getDialogTitle()}
    >
      <EstimateFormPages 
        currentPage={currentPage}
        formData={formData}
        previewEstimate={previewEstimate}
        isSubmitting={isSubmitting}
        isEditing={!!editingEstimate}
        onUpdateFormData={handleUpdateFormData}
        onPrevious={handlePreviousPage}
        onNext={handleNextWithValidation}
        onSave={handleSaveEstimate}
      />
    </FormWrapper>
  );
}
