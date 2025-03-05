
import Layout from "@/components/Layout";

export default function SchedulingPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Scheduling</h1>
          <p className="text-sm text-muted-foreground">
            Manage your photography and videography schedules
          </p>
        </div>
        
        <div className="grid gap-4">
          {/* Scheduling content will go here */}
          <div className="border rounded-lg p-6 text-center">
            <p>Scheduling module is under development</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
