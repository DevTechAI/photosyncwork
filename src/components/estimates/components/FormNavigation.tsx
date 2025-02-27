
import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  currentPage: number;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function FormNavigation({
  currentPage,
  isSubmitting,
  onPrevious,
  onNext
}: FormNavigationProps) {
  return (
    <div className="flex justify-between pt-6 border-t">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentPage === 0}
      >
        Previous
      </Button>
      <Button
        onClick={onNext}
        disabled={isSubmitting}
      >
        {currentPage === 2 
          ? "Preview Estimate"
          : currentPage === 3
          ? (isSubmitting ? "Creating..." : "Create Estimate")
          : "Next"}
      </Button>
    </div>
  );
}
