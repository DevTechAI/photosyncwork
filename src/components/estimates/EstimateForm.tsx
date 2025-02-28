
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormWrapper } from "./form/FormWrapper";
import { EstimateFormPages } from "./form/EstimateFormPages";
import { useEstimateForm } from "./form/hooks/useEstimateForm";

interface EstimateFormProps {
  open: boolean;
  onClose: () => void;
  editingEstimate?: any;
}

export function EstimateForm({ open, onClose, editingEstimate }: EstimateFormProps) {
  const navigate = useNavigate();
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
        onNext={handleNextPage}
        onSave={handleSaveEstimate}
      />
    </FormWrapper>
  );
}
