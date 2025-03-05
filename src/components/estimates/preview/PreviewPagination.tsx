
import { Button } from "@/components/ui/button";

interface PreviewPaginationProps {
  currentPageIndex: number;
  setCurrentPageIndex: (index: number) => void;
}

export function PreviewPagination({ 
  currentPageIndex, 
  setCurrentPageIndex 
}: PreviewPaginationProps) {
  return (
    <div className="flex justify-between mt-6">
      <Button
        onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
        disabled={currentPageIndex === 0}
        variant="outline"
      >
        Previous
      </Button>
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <Button
            key={index}
            variant={currentPageIndex === index ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPageIndex(index)}
            className="px-3 py-1"
          >
            {index === 0 ? "Intro" : index === 1 ? "Services" : "Estimate"}
          </Button>
        ))}
      </div>
      <Button
        onClick={() => setCurrentPageIndex(Math.min(2, currentPageIndex + 1))}
        disabled={currentPageIndex === 2}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
}
