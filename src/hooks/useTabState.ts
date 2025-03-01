
import { useState } from "react";

export function useTabState(defaultTab: string = "details") {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return {
    activeTab,
    setActiveTab
  };
}
