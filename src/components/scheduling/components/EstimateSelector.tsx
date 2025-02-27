
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface EstimateSelectorProps {
  selectedEstimateId: string;
  approvedEstimates: any[];
  onEstimateChange: (estimateId: string) => void;
}

export function EstimateSelector({ 
  selectedEstimateId, 
  approvedEstimates, 
  onEstimateChange 
}: EstimateSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="estimate-select">Based on Approved Estimate</Label>
      <Select
        value={selectedEstimateId}
        onValueChange={onEstimateChange}
      >
        <SelectTrigger id="estimate-select">
          <SelectValue placeholder="Select an approved estimate (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">None (Manual Entry)</SelectItem>
          {approvedEstimates.map((estimate) => (
            <SelectItem key={estimate.id} value={estimate.id}>
              {estimate.clientName} - {estimate.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedEstimateId && (
        <p className="text-xs text-muted-foreground">
          Event details will be populated from the selected estimate
        </p>
      )}
    </div>
  );
}
