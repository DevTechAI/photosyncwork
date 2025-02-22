
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface DeliverablesProps {
  deliverables: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

export function Deliverables({ deliverables, onAdd, onUpdate, onRemove }: DeliverablesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Deliverables</h3>
      {deliverables.map((deliverable, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={deliverable}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder="Enter deliverable"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Deliverable
      </Button>
    </div>
  );
}
