
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Plus, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { EstimateForm } from "@/components/estimates/EstimateForm";
import { useNavigate } from "react-router-dom";

// Mock data for estimates
const initialEstimates = [
  {
    id: "est-1",
    clientName: "Raj & Simran Wedding",
    date: "2023-11-15",
    amount: "₹250,000",
    status: "pending"
  }
];

export default function EstimatesPage() {
  const navigate = useNavigate();
  const [showNewEstimateForm, setShowNewEstimateForm] = useState(false);
  const [estimates, setEstimates] = useState(() => {
    // Try to get estimates from localStorage
    const savedEstimates = localStorage.getItem("estimates");
    return savedEstimates ? JSON.parse(savedEstimates) : initialEstimates;
  });

  // Save estimates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("estimates", JSON.stringify(estimates));
  }, [estimates]);

  // Function to handle navigating to pre-production
  const handleContinueToPreProduction = (estimateId: string) => {
    navigate(`/pre-production?estimateId=${estimateId}`);
  };

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
          {estimates.length > 0 ? (
            estimates.map((estimate) => (
              <Card key={estimate.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{estimate.clientName}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Created: {new Date(estimate.date).toLocaleDateString()}</span>
                      <span>Amount: {estimate.amount}</span>
                      <span className="capitalize">Status: {estimate.status}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleContinueToPreProduction(estimate.id)}
                  >
                    Continue to Pre-Production
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
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
          )}
        </div>

        <EstimateForm
          open={showNewEstimateForm}
          onClose={() => setShowNewEstimateForm(false)}
        />
      </div>
    </Layout>
  );
}
