
import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  currentPage: number;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  hidePrevious?: boolean;
}

export function FormNavigation({ 
  currentPage, 
  isSubmitting, 
  onPrevious, 
  onNext,
  hidePrevious = false
}: FormNavigationProps) {
  return (
    <div className="flex justify-between">
      {!hidePrevious && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={currentPage === 0 || isSubmitting}
        >
          Previous
        </Button>
      )}
      <div className="flex-1"></div>
      <Button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
      >
        {currentPage === 2 ? "Preview" : "Next"}
      </Button>
    </div>
  );
}
