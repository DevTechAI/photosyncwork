
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Plus, ArrowRight, Eye, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { EstimateForm } from "@/components/estimates/EstimateForm";
import { EstimatePreview } from "@/components/estimates/EstimatePreview";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function EstimatesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNewEstimateForm, setShowNewEstimateForm] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [estimates, setEstimates] = useState(() => {
    const savedEstimates = localStorage.getItem("estimates");
    return savedEstimates ? JSON.parse(savedEstimates) : [];
  });

  useEffect(() => {
    localStorage.setItem("estimates", JSON.stringify(estimates));
  }, [estimates]);

  const handleContinueToPreProduction = async (estimateId: string) => {
    const estimate = estimates.find(est => est.id === estimateId);
    
    if (estimate && estimate.status === "approved") {
      try {
        // Send onboarding email
        const { error } = await supabase.functions.invoke('send-onboarding-email', {
          body: {
            to: estimate.clientEmail, // Make sure to capture client email during estimate creation
            clientName: estimate.clientName,
            estimateId: estimate.id
          }
        });

        if (error) throw error;

        // Store the selected estimate in localStorage for pre-production
        localStorage.setItem("selectedEstimate", JSON.stringify(estimate));
        
        // Navigate to pre-production
        navigate(`/pre-production?estimateId=${estimateId}`);
        
        toast({
          title: "Success",
          description: "Onboarding email sent and proceeding to pre-production.",
        });
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to proceed. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Not Approved",
        description: "Estimate must be approved by the client before proceeding to pre-production.",
        variant: "destructive",
      });
    }
  };

  const handleEditEstimate = (estimate) => {
    setSelectedEstimate(estimate);
    setIsEditing(true);
    setShowNewEstimateForm(true);
  };

  const handleOpenPreview = (estimate) => {
    setSelectedEstimate(estimate);
    setShowPreview(true);
  };

  const handleStatusChange = (estimateId: string, newStatus: string, negotiatedAmount?: string) => {
    const updatedEstimates = estimates.map(est => {
      if (est.id === estimateId) {
        const updatedEstimate = {
          ...est,
          status: newStatus,
        };
        
        // If there's a negotiated amount, update all package amounts proportionally
        if (negotiatedAmount) {
          const ratio = parseFloat(negotiatedAmount) / parseFloat(est.amount);
          updatedEstimate.amount = negotiatedAmount;
          if (updatedEstimate.packages) {
            updatedEstimate.packages = updatedEstimate.packages.map(pkg => ({
              ...pkg,
              amount: (parseFloat(pkg.amount) * ratio).toFixed(2)
            }));
          }
        }
        
        return updatedEstimate;
      }
      return est;
    });
    
    setEstimates(updatedEstimates);
    setSelectedEstimate(updatedEstimates.find(est => est.id === estimateId));
    
    // Show appropriate toast message based on status
    const toastMessages = {
      approved: "Estimate has been approved! Proceeding to next steps.",
      declined: "Estimate has been declined.",
      negotiating: "Estimate status updated to negotiating.",
      pending: "Estimate status updated to pending."
    };
    
    toast({
      title: "Status Updated",
      description: toastMessages[newStatus] || "Estimate status has been updated.",
      variant: newStatus === "declined" ? "destructive" : "default"
    });
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
          <Button onClick={() => {
            setIsEditing(false);
            setSelectedEstimate(null);
            setShowNewEstimateForm(true);
          }}>
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
                      onClick={() => handleEditEstimate(estimate)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
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
          onClose={() => {
            setShowNewEstimateForm(false);
            setIsEditing(false);
            setSelectedEstimate(null);
          }}
          editingEstimate={isEditing ? selectedEstimate : null}
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
