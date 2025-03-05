
import Layout from "@/components/Layout";

export default function InvoicesPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage client invoices
          </p>
        </div>
        
        <div className="grid gap-4">
          {/* Invoices content will go here */}
          <div className="border rounded-lg p-6 text-center">
            <p>Invoices module is under development</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
