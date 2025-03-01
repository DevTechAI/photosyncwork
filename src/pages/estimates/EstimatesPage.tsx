import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Plus, Eye, Edit, Check, X, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { EstimateForm } from "@/components/estimates/EstimateForm";
import { EstimatePreview } from "@/components/estimates/EstimatePreview";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EstimatesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNewEstimateForm, setShowNewEstimateForm] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState("pending");
  const [estimates, setEstimates] = useState(() => {
    const savedEstimates = localStorage.getItem("estimates");
    return savedEstimates ? JSON.parse(savedEstimates) : [];
  });

  useEffect(() => {
    localStorage.setItem("estimates", JSON.stringify(estimates));
  }, [estimates]);

  const handleEditEstimate = (estimate) => {
    setSelectedEstimate(estimate);
    setIsEditing(true);
    setShowNewEstimateForm(true);
  };

  const handleOpenPreview = (estimate) => {
    setSelectedEstimate(estimate);
    setShowPreview(true);
  };

  const handleStatusChange = (estimateId: string, newStatus: string, negotiatedAmount?: string, selectedPackageIndex?: number) => {
    const updatedEstimates = estimates.map(est => {
      if (est.id === estimateId) {
        const updatedEstimate = {
          ...est,
          status: newStatus,
          selectedPackageIndex: selectedPackageIndex
        };
        
        // If there's a selected package, update the main amount with that package's amount
        if (selectedPackageIndex !== undefined && updatedEstimate.packages && updatedEstimate.packages[selectedPackageIndex]) {
          updatedEstimate.amount = updatedEstimate.packages[selectedPackageIndex].amount;
        }
        
        // If there's a negotiated amount, update all package amounts proportionally
        if (negotiatedAmount) {
          updatedEstimate.amount = negotiatedAmount;
          
          // If there's a selected package, we only need to update that one
          if (selectedPackageIndex !== undefined && updatedEstimate.packages) {
            updatedEstimate.packages = updatedEstimate.packages.map((pkg, idx) => {
              if (idx === selectedPackageIndex) {
                return {
                  ...pkg,
                  amount: negotiatedAmount
                };
              }
              return pkg;
            });
          }
          // Otherwise update all packages proportionally (legacy behavior)
          else if (updatedEstimate.packages) {
            const ratio = parseFloat(negotiatedAmount) / parseFloat(est.amount);
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

  // Quick action to approve or decline an estimate
  const handleQuickStatusChange = (estimateId: string, newStatus: string) => {
    handleStatusChange(estimateId, newStatus);
    setShowPreview(false);
  };

  // Filter estimates based on the current tab
  const filteredEstimates = estimates.filter(estimate => {
    if (currentTab === "pending") return estimate.status === "pending" || estimate.status === "negotiating";
    if (currentTab === "approved") return estimate.status === "approved";
    if (currentTab === "declined") return estimate.status === "declined";
    return true;
  });

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

        <Tabs defaultValue="pending" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="declined">Declined</TabsTrigger>
          </TabsList>

          <TabsContent value={currentTab} className="space-y-4">
            {filteredEstimates.length > 0 ? (
              filteredEstimates.map((estimate) => (
                <Card key={estimate.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{estimate.clientName}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Created: {new Date(estimate.date).toLocaleDateString()}</span>
                        <span>Amount: {estimate.amount}</span>
                        {estimate.selectedPackageIndex !== undefined && estimate.packages && (
                          <span>Selected Package: Option {estimate.selectedPackageIndex + 1}</span>
                        )}
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
                        View
                      </Button>
                      
                      {(estimate.status === "pending" || estimate.status === "negotiating") && (
                        <>
                          <Button 
                            variant="outline"
                            onClick={() => handleEditEstimate(estimate)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                            onClick={() => handleQuickStatusChange(estimate.id, "approved")}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                            onClick={() => handleQuickStatusChange(estimate.id, "declined")}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </>
                      )}
                      
                      {estimate.status === "approved" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button>
                              Next Steps
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => navigate("/invoices")}>
                              Create Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate("/pre-production")}>
                              Pre-Production Tasks
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate("/scheduling")}>
                              Schedule Events
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <FileText className="h-8 w-8 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No {currentTab} estimates
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  {currentTab === "pending" ? 
                    "Create a new estimate or wait for client responses." :
                    currentTab === "approved" ? 
                    "Approved estimates will appear here." :
                    "Declined estimates will appear here."}
                </p>
                {currentTab === "pending" && (
                  <Button onClick={() => setShowNewEstimateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Estimate
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

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
