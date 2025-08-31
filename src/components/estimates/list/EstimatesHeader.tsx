
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PermissionGuard } from "@/components/rbac/PermissionGuard";
import { PERMISSIONS } from "@/types/rbac";

interface EstimatesHeaderProps {
  onNewEstimate: () => void;
  canCreate?: boolean;
}

export function EstimatesHeader({ onNewEstimate, canCreate = true }: EstimatesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Estimates</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage your photography service estimates.
        </p>
      </div>
      <PermissionGuard permission={PERMISSIONS.ESTIMATES_CREATE}>
        <Button onClick={onNewEstimate}>
          <Plus className="h-4 w-4 mr-2" />
          New Estimate
        </Button>
      </PermissionGuard>
    </div>
  );
}
