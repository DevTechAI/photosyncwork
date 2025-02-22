
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { EstimateForm } from "@/components/estimates/EstimateForm";

export default function EstimatesPage() {
  const [showNewEstimateForm, setShowNewEstimateForm] = useState(false);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Estimates</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage your photography service estimates.
            </p>
          </div>
          <Button onClick={() => setShowNewEstimateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Estimate
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
            <FileText className="h-8 w-8 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No estimates yet
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create your first estimate to start tracking potential projects.
            </p>
            <Button onClick={() => setShowNewEstimateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Estimate
            </Button>
          </div>
        </div>

        <EstimateForm
          open={showNewEstimateForm}
          onClose={() => setShowNewEstimateForm(false)}
        />
      </div>
    </Layout>
  );
}
