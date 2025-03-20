
import React from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon, RefreshCw } from "lucide-react";

interface ReportsHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export function ReportsHeader({ isLoading, onRefresh }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Financial Reports</h2>
        <p className="text-muted-foreground mt-1">
          Analyze your financial data and trends
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button variant="outline">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>
    </div>
  );
}
