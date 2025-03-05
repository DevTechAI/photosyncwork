
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SchedulingHeaderProps {
  onCreateEvent: () => void;
}

export function SchedulingHeader({ onCreateEvent }: SchedulingHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Scheduling</h1>
        <p className="text-sm text-muted-foreground">
          Manage your shoots, team assignments, and workflow
        </p>
      </div>
      <Button onClick={onCreateEvent}>
        <Plus className="h-4 w-4 mr-2" />
        New Event
      </Button>
    </div>
  );
}
