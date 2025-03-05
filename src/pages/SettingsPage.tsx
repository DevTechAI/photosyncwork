
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { CompanyDetailsForm } from "@/components/settings/CompanyDetailsForm";
import { TeamMembersTable } from "@/components/settings/TeamMembersTable";
import { VendorsTable } from "@/components/settings/VendorsTable";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your company settings, team members, and vendors
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <CompanyDetailsForm />
          </TabsContent>

          <TabsContent value="team">
            <TeamMembersTable />
          </TabsContent>

          <TabsContent value="vendors">
            <VendorsTable />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
