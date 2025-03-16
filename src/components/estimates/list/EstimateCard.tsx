
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Check, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "@/hooks/invoices/useInvoices";
import { useToast } from "@/components/ui/use-toast";

interface EstimateCardProps {
  estimate: {
    id: string;
    clientName: string;
    date: string;
    amount: string;
    status: string;
    selectedPackageIndex?: number;
    packages?: Array<any>;
    clientEmail?: string;
  };
  onEdit: (estimate: any) => void;
  onPreview: (estimate: any) => void;
  onStatusChange: (estimateId: string, newStatus: string) => void;
  onGoToScheduling: (estimateId: string) => void;
}

export function EstimateCard({ 
  estimate, 
  onEdit, 
  onPreview, 
  onStatusChange,
  onGoToScheduling
}: EstimateCardProps) {
  const navigate = useNavigate();
  const { hasInvoiceForEstimate } = useInvoices();
  const { toast } = useToast();

  // Handle navigation to invoice page with estimate data
  const handleCreateInvoice = () => {
    // Check if an invoice already exists for this estimate
    if (hasInvoiceForEstimate(estimate.id)) {
      toast({
        title: "Invoice Already Exists",
        description: "An invoice has already been created for this estimate.",
        variant: "destructive"
      });
      return;
    }
    
    navigate("/invoices", { 
      state: { 
        fromEstimate: estimate 
      } 
    });
  };

  return (
    <Card key={estimate.id} className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{estimate.clientName}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>Created: {new Date(estimate.date).toLocaleDateString()}</span>
            <span>Amount: {estimate.amount}</span>
            {estimate.selectedPackageIndex !== undefined && estimate.packages && (
              <span>Selected Package: {estimate.packages[estimate.selectedPackageIndex]?.name || 
                `Option ${estimate.selectedPackageIndex + 1}`}</span>
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
            onClick={() => onPreview(estimate)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          
          {(estimate.status === "pending" || estimate.status === "negotiating") && (
            <>
              <Button 
                variant="outline"
                onClick={() => onEdit(estimate)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                onClick={() => onStatusChange(estimate.id, "approved")}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button 
                variant="outline" 
                className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                onClick={() => onStatusChange(estimate.id, "declined")}
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
                <DropdownMenuItem onClick={handleCreateInvoice}>
                  Create Invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/pre-production")}>
                  Pre-Production Tasks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onGoToScheduling(estimate.id)}>
                  Schedule Events
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </Card>
  );
}
