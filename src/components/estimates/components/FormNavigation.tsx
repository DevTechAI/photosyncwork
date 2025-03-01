
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormNavigationProps {
  currentPage: number;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  hidePrevious?: boolean;
  isNextDisabled?: boolean;
}

export function FormNavigation({
  currentPage,
  isSubmitting,
  onPrevious,
  onNext,
  hidePrevious = false,
  isNextDisabled = false,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between mt-6">
      {!hidePrevious && (
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentPage === 0 || isSubmitting}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
      )}
      <div className="flex-1" />
      <Button
        onClick={onNext}
        disabled={isSubmitting || isNextDisabled}
      >
        {currentPage === 2 ? "Preview" : "Next"}
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
