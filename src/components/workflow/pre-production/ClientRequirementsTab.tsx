
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ClientRequirementsTabProps {
  clientRequirements: string;
  setClientRequirements: (value: string) => void;
  handleSaveRequirements: () => void;
}

export function ClientRequirementsTab({ 
  clientRequirements, 
  setClientRequirements, 
  handleSaveRequirements 
}: ClientRequirementsTabProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Client Requirements</h2>
      <div className="space-y-4">
        <Textarea
          placeholder="Enter client requirements, expectations, and any special instructions..."
          value={clientRequirements}
          onChange={(e) => setClientRequirements(e.target.value)}
          rows={8}
        />
        <Button onClick={handleSaveRequirements}>Save Requirements</Button>
      </div>
    </Card>
  );
}
