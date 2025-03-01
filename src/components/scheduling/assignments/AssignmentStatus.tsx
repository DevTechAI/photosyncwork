
import { CheckCircle, AlertTriangle } from "lucide-react";
import { AssignmentCounts } from "./types";

interface AssignmentStatusProps {
  counts: AssignmentCounts;
  photographersCount: number;
  videographersCount: number;
}

export function AssignmentStatus({ counts, photographersCount, videographersCount }: AssignmentStatusProps) {
  const photographersMatch = counts.totalPhotographers === photographersCount;
  const videographersMatch = counts.totalVideographers === videographersCount;
  const allAssigned = photographersMatch && videographersMatch;
  const pendingAssignments = counts.pendingPhotographers + counts.pendingVideographers > 0;
  
  if (allAssigned) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Fully Assigned
      </span>
    );
  } else if (pendingAssignments) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Pending Responses
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-amber-100 text-amber-800">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Needs Assignment
      </span>
    );
  }
}
