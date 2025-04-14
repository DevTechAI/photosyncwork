
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SchedulingHeaderProps {
  onCreateEvent: () => void;
}

export function SchedulingHeader({ onCreateEvent }: SchedulingHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2 hidden md:flex" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Scheduling</h1>
          <p className="text-muted-foreground">Manage your events and team assignments</p>
        </div>
      </div>
      
      <Button onClick={onCreateEvent}>
        <Plus className="mr-2 h-4 w-4" />
        Create Event
      </Button>
    </div>
  );
}
