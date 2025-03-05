
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EstimatesHeaderProps {
  onNewEstimate: () => void;
}

export function EstimatesHeader({ onNewEstimate }: EstimatesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Estimates</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage your photography service estimates.
        </p>
      </div>
      <Button onClick={onNewEstimate}>
        <Plus className="h-4 w-4 mr-2" />
        New Estimate
      </Button>
    </div>
  );
}
