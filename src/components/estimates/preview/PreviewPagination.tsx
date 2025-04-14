
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
        {[0, 1, 2, 3, 4].map((index) => (
          <Button
            key={index}
            variant={currentPageIndex === index ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPageIndex(index)}
            className="px-3 py-1"
          >
            {index === 0 ? "Intro" : 
             index === 1 ? "Services" : 
             index === 2 ? "Estimate" : 
             index === 3 ? "Portfolio" : "Template"}
          </Button>
        ))}
      </div>
      <Button
        onClick={() => setCurrentPageIndex(Math.min(4, currentPageIndex + 1))}
        disabled={currentPageIndex === 4}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
}
