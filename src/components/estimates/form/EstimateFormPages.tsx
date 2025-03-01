
import { WelcomePage } from "../pages/WelcomePage";
import { ServicesPage } from "../pages/ServicesPage";
import { EstimateDetailsPage } from "../pages/EstimateDetailsPage";
import { PreviewStep } from "../components/PreviewStep";
import { FormNavigation } from "../components/FormNavigation";
import { EstimateFormData } from "./types";

interface EstimateFormPagesProps {
  currentPage: number;
  formData: EstimateFormData;
  previewEstimate: any;
  isSubmitting: boolean;
  isEditing: boolean;
  onUpdateFormData: (key: keyof EstimateFormData, value: any) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => Promise<void>;
}

export function EstimateFormPages({
  currentPage,
  formData,
  previewEstimate,
  isSubmitting,
  isEditing,
  onUpdateFormData,
  onPrevious,
  onNext,
  onSave
}: EstimateFormPagesProps) {
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <WelcomePage 
            clientName={formData.clientName}
            clientEmail={formData.clientEmail}
            onClientNameChange={(name) => 
              onUpdateFormData("clientName", name)
            }
            onClientEmailChange={(email) =>
              onUpdateFormData("clientEmail", email)
            }
            isReadOnly={isEditing}
          />
        );
      case 1:
        return (
          <ServicesPage 
            selectedServices={formData.selectedServices}
            onServicesChange={(services) =>
              onUpdateFormData("selectedServices", services)
            }
            isReadOnly={isEditing}
          />
        );
      case 2:
        return (
          <EstimateDetailsPage 
            estimateDetails={formData.estimateDetails}
            onDetailsChange={(details) =>
              onUpdateFormData("estimateDetails", details)
            }
          />
        );
      case 3:
        return previewEstimate ? (
          <PreviewStep 
            estimate={previewEstimate} 
            onSave={onSave}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <>
      {renderCurrentPage()}
      
      {(currentPage < 3 || !previewEstimate) && (
        <FormNavigation
          currentPage={currentPage}
          isSubmitting={isSubmitting}
          onPrevious={onPrevious}
          onNext={onNext}
          hidePrevious={isEditing && currentPage === 2}
          isNextDisabled={currentPage === 0 && !formData.clientName.trim()}
        />
      )}
    </>
  );
}
