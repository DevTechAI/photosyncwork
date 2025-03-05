
import { useState } from "react";
import { ModalTab } from "./useCreateEventModal";

export function useEventModalState(initialEstimateId: string | undefined) {
  const [activeTab, setActiveTab] = useState<ModalTab>("details");
  const [selectedEstimateId, setSelectedEstimateId] = useState(initialEstimateId || "");
  const [approvedEstimates, setApprovedEstimates] = useState<any[]>([]);
  
  return {
    activeTab,
    setActiveTab,
    selectedEstimateId,
    setSelectedEstimateId,
    approvedEstimates,
    setApprovedEstimates
  };
}
