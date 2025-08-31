
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./tabs/OverviewTab";
import { TeamTab } from "./tabs/TeamTab";
import { ProjectsTab } from "./tabs/ProjectsTab";
import { FinancesTab } from "./tabs/FinancesTab";
import { ClientsTab } from "./tabs/ClientsTab";
import { PermissionGuard } from "@/components/rbac/PermissionGuard";
import { PERMISSIONS } from "@/types/rbac";

export function ManagerDashboard() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Manager Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Complete overview of your business operations
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <PermissionGuard permission={PERMISSIONS.CLIENTS_VIEW} fallback={<></>}>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.TEAM_VIEW} fallback={<></>}>
            <TabsTrigger value="team">Team</TabsTrigger>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.WORKFLOW_VIEW} fallback={<></>}>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.FINANCES_VIEW} fallback={<></>}>
            <TabsTrigger value="finances">Finances</TabsTrigger>
          </PermissionGuard>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <PermissionGuard permission={PERMISSIONS.CLIENTS_VIEW}>
          <TabsContent value="clients">
            <ClientsTab />
          </TabsContent>
        </PermissionGuard>

        <PermissionGuard permission={PERMISSIONS.TEAM_VIEW}>
          <TabsContent value="team">
            <TeamTab />
          </TabsContent>
        </PermissionGuard>

        <PermissionGuard permission={PERMISSIONS.WORKFLOW_VIEW}>
          <TabsContent value="projects">
            <ProjectsTab />
          </TabsContent>
        </PermissionGuard>

        <PermissionGuard permission={PERMISSIONS.FINANCES_VIEW}>
          <TabsContent value="finances">
            <FinancesTab />
          </TabsContent>
        </PermissionGuard>
      </Tabs>
    </div>
  );
}
