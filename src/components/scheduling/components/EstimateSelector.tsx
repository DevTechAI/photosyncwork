
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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
              <div className="flex items-center gap-2">
                <span>{estimate.clientName}</span>
                <Badge variant="outline" className="ml-2">
                  {new Date(estimate.date).toLocaleDateString()}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedEstimateId && (
        <div className="text-xs text-muted-foreground mt-2">
          <p>Event details will be populated from the selected estimate</p>
          {approvedEstimates.find(est => est.id === selectedEstimateId)?.packages && (
            <div className="mt-2">
              <span className="font-medium">Available Packages:</span> 
              {approvedEstimates.find(est => est.id === selectedEstimateId)?.packages.map((pkg, idx) => (
                <Badge key={idx} variant="secondary" className="ml-2">
                  Option {idx + 1}: {pkg.amount}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
