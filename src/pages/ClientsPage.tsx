
import Layout from "@/components/Layout";

export default function ClientsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-sm text-muted-foreground">
            Manage your client relationships
          </p>
        </div>
        
        <div className="grid gap-4">
          {/* Client content will go here */}
          <div className="border rounded-lg p-6 text-center">
            <p>Client management module is under development</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
