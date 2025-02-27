
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Plus, ArrowRight, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { EstimateForm } from "@/components/estimates/EstimateForm";
import { EstimatePreview } from "@/components/estimates/EstimatePreview";
import { useNavigate } from "react-router-dom";

// Mock data for estimates
const initialEstimates = [
  {
    id: "est-1",
    clientName: "Raj & Simran Wedding",
    date: "2023-11-15",
    amount: "₹250,000",
    status: "pending",
    services: [
      {
        event: "Wedding",
        date: "2023-12-15",
        photographers: "2",
        cinematographers: "1"
      },
      {
        event: "Reception",
        date: "2023-12-16",
        photographers: "1",
        cinematographers: "1"
      }
    ],
    deliverables: [
      "Curated online Gallery with 400+ images",
      "Wedding film 8-12mins (with live audio & Audio bytes)",
      "Customised 35 Sheet Album - 2 Copies"
    ]
  }
];

export default function EstimatesPage() {
  const navigate = useNavigate();
  const [showNewEstimateForm, setShowNewEstimateForm] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
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
    // Get the estimate data to pass to pre-production
    const estimate = estimates.find(est => est.id === estimateId);
    
    if (estimate && estimate.status === "approved") {
      // Store the selected estimate in localStorage for pre-production
      localStorage.setItem("selectedEstimate", JSON.stringify(estimate));
      navigate(`/pre-production?estimateId=${estimateId}`);
    } else {
      // Show error if the estimate is not approved
      alert("Estimate must be approved by the client before proceeding to pre-production.");
    }
  };

  // Function to handle opening estimate preview
  const handleOpenPreview = (estimate) => {
    setSelectedEstimate(estimate);
    setShowPreview(true);
  };

  // Function to handle estimate status change
  const handleStatusChange = (estimateId: string, newStatus: string, negotiatedAmount?: string) => {
    const updatedEstimates = estimates.map(est => {
      if (est.id === estimateId) {
        return {
          ...est,
          status: newStatus,
          amount: negotiatedAmount || est.amount
        };
      }
      return est;
    });
    
    setEstimates(updatedEstimates);
    setSelectedEstimate(updatedEstimates.find(est => est.id === estimateId));
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
                      <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                        estimate.status === "approved" ? "bg-green-100 text-green-800" :
                        estimate.status === "declined" ? "bg-red-100 text-red-800" :
                        estimate.status === "negotiating" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {estimate.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => handleOpenPreview(estimate)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      onClick={() => handleContinueToPreProduction(estimate.id)}
                      disabled={estimate.status !== "approved"}
                    >
                      Continue to Pre-Production
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
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

        {selectedEstimate && (
          <EstimatePreview
            open={showPreview}
            onClose={() => setShowPreview(false)}
            estimate={selectedEstimate}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </Layout>
  );
}
