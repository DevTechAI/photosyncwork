import { ReactNode } from "react";
import { useRBAC } from "@/hooks/rbac/useRBAC";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldX } from "lucide-react";

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  module?: string;
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean; // If true, user must have ALL permissions/roles
}

export function PermissionGuard({
  permission,
  permissions,
  role,
  roles,
  module,
  children,
  fallback,
  requireAll = false
}: PermissionGuardProps) {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasRole, 
    hasAnyRole, 
    canAccessModule,
    loading 
  } = useRBAC();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  let hasAccess = true;

  // Check module access
  if (module) {
    hasAccess = hasAccess && canAccessModule(module);
  }

  // Check single permission
  if (permission) {
    hasAccess = hasAccess && hasPermission(permission);
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasAccess = hasAccess && permissions.every(p => hasPermission(p));
    } else {
      hasAccess = hasAccess && hasAnyPermission(permissions);
    }
  }

  // Check single role
  if (role) {
    hasAccess = hasAccess && hasRole(role);
  }

  // Check multiple roles
  if (roles && roles.length > 0) {
    if (requireAll) {
      hasAccess = hasAccess && roles.every(r => hasRole(r));
    } else {
      hasAccess = hasAccess && hasAnyRole(roles);
    }
  }

  // Render based on access
  if (hasAccess) {
    return <>{children}</>;
  }

  // Show fallback or default access denied message
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Alert variant="destructive" className="m-4">
      <ShieldX className="h-4 w-4" />
      <AlertDescription>
        You don't have permission to access this feature. Contact your administrator if you believe this is an error.
      </AlertDescription>
    </Alert>
  );
}