
import Layout from "@/components/Layout";

export default function EstimatesPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Estimates</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage client estimates
          </p>
        </div>
        
        <div className="grid gap-4">
          {/* Estimates content will go here */}
          <div className="border rounded-lg p-6 text-center">
            <p>Estimates module is under development</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
