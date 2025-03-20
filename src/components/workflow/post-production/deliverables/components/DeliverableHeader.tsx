
import React from "react";
import { getDeliverableTypeIcon, getStatusBadgeClass } from "../utils/deliverableUtils";

interface DeliverableHeaderProps {
  type: string;
  status: string;
}

export function DeliverableHeader({ type, status }: DeliverableHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        {getDeliverableTypeIcon(type)}
        <span className="font-medium capitalize">
          {type ? type.charAt(0).toUpperCase() + type.slice(1) : "Unknown"}
        </span>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(status)}`}>
        {status ? status.replace("-", " ") : "pending"}
      </span>
    </div>
  );
}
