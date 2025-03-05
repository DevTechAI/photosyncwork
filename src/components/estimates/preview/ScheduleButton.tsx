
import { Button } from "@/components/ui/button";

interface ScheduleButtonProps {
  isApproved: boolean;
  onSchedule: () => void;
}

export function ScheduleButton({ isApproved, onSchedule }: ScheduleButtonProps) {
  if (!isApproved) return null;
  
  return (
    <div className="mt-6 flex justify-center">
      <Button className="w-full max-w-md" onClick={onSchedule}>
        Schedule Events From This Estimate
      </Button>
    </div>
  );
}
