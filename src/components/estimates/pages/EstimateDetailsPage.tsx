
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EstimateDetails, Service } from "../types";
import { EstimateCard } from "../components/EstimateCard";
import { useToast } from "@/components/ui/use-toast";

interface EstimateDetailsPageProps {
  estimateDetails: EstimateDetails;
  onDetailsChange: (details: EstimateDetails) => void;
}

export function EstimateDetailsPage({ estimateDetails, onDetailsChange }: EstimateDetailsPageProps) {
  const { toast } = useToast();
  
  const addEstimate = () => {
    // Check if we've reached the maximum of 3 estimate options
    if (estimateDetails.estimates.length >= 3) {
      toast({
        title: "Maximum packages reached",
        description: "You can only create up to 3 package options",
        variant: "destructive",
      });
      return;
    }
    
    onDetailsChange({
      ...estimateDetails,
      estimates: [
        ...estimateDetails.estimates,
        { 
          services: [], 
          total: "",
          deliverables: [
            "Curated online Gallery with 400+ images",
            "1200+ Processed Images in hard drive (provided by you)",
            "20-90 min Documentary film of all events Individually, delivered online for you to download",
            "Wedding film 8-12mins (with live audio & Audio bytes) - delivered online with password protection",
            "Live streaming for Wedding event only - Complimentary",
            "Customised 35 Sheet Album - 2 Copies"
          ]
        }
      ]
    });
  };

  const addService = (estimateIndex: number) => {
    const newEstimates = [...estimateDetails.estimates];
    newEstimates[estimateIndex].services.push({
      event: "",
      date: "",
      photographers: "",
      cinematographers: ""
    });
    onDetailsChange({
      ...estimateDetails,
      estimates: newEstimates
    });
  };

  const updateService = (
    estimateIndex: number,
    serviceIndex: number,
    field: keyof Service,
    value: string
  ) => {
    const newEstimates = [...estimateDetails.estimates];
    newEstimates[estimateIndex].services[serviceIndex][field] = value;
    onDetailsChange({
      ...estimateDetails,
      estimates: newEstimates
    });
  };

  const removeService = (estimateIndex: number, serviceIndex: number) => {
    const newEstimates = [...estimateDetails.estimates];
    newEstimates[estimateIndex].services.splice(serviceIndex, 1);
    onDetailsChange({
      ...estimateDetails,
      estimates: newEstimates
    });
  };

  const addDeliverable = (estimateIndex: number) => {
    const newEstimates = [...estimateDetails.estimates];
    newEstimates[estimateIndex].deliverables.push("");
    onDetailsChange({
      ...estimateDetails,
      estimates: newEstimates
    });
  };

  const updateDeliverable = (estimateIndex: number, deliverableIndex: number, value: string) => {
    const newEstimates = [...estimateDetails.estimates];
    newEstimates[estimateIndex].deliverables[deliverableIndex] = value;
    onDetailsChange({
      ...estimateDetails,
      estimates: newEstimates
    });
  };

  const removeDeliverable = (estimateIndex: number, deliverableIndex: number) => {
    const newEstimates = [...estimateDetails.estimates];
    newEstimates[estimateIndex].deliverables.splice(deliverableIndex, 1);
    onDetailsChange({
      ...estimateDetails,
      estimates: newEstimates
    });
  };

  const updateEstimateTotal = (estimateIndex: number, total: string) => {
    const newEstimates = [...estimateDetails.estimates];
    
    // We need to check if this total makes the package identical to another
    const isIdentical = checkIfIdenticalPackage(estimateIndex, {
      ...newEstimates[estimateIndex],
      total
    });
    
    if (isIdentical) {
      toast({
        title: "Identical package detected",
        description: "Please ensure each package is unique by varying deliverables or pricing",
        variant: "destructive",
      });
      return;
    }
    
    newEstimates[estimateIndex].total = total;
    onDetailsChange({
      ...estimateDetails,
      estimates: newEstimates
    });
  };
  
  const checkIfIdenticalPackage = (currentIndex: number, updatedPackage: any) => {
    // We'll compare the deliverables list and total amount to check for identical packages
    // Event services are allowed to be the same across packages
    
    for (let i = 0; i < estimateDetails.estimates.length; i++) {
      // Skip comparing with itself
      if (i === currentIndex) continue;
      
      const otherPackage = estimateDetails.estimates[i];
      
      // Check if total is the same
      if (updatedPackage.total === otherPackage.total) {
        
        // Check if deliverables are the same
        // Convert to strings for comparison
        const updatedDeliverables = JSON.stringify(updatedPackage.deliverables.sort());
        const otherDeliverables = JSON.stringify(otherPackage.deliverables.sort());
        
        if (updatedDeliverables === otherDeliverables) {
          return true; // Identical package found
        }
      }
    }
    
    return false; // No identical package found
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-light">ESTIMATES</h2>
        <p className="text-sm text-muted-foreground">as per your requirement</p>
        
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Events Coverage</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Candid Photography & Cinematography (All events)
                </p>
              </div>
            </div>

            {estimateDetails.estimates.map((estimate, estimateIndex) => (
              <EstimateCard
                key={estimateIndex}
                estimate={estimate}
                index={estimateIndex}
                onServiceAdd={() => addService(estimateIndex)}
                onServiceUpdate={(serviceIndex, field, value) => 
                  updateService(estimateIndex, serviceIndex, field, value)}
                onServiceRemove={(serviceIndex) => removeService(estimateIndex, serviceIndex)}
                onDeliverableAdd={() => addDeliverable(estimateIndex)}
                onDeliverableUpdate={(deliverableIndex, value) => 
                  updateDeliverable(estimateIndex, deliverableIndex, value)}
                onDeliverableRemove={(deliverableIndex) => 
                  removeDeliverable(estimateIndex, deliverableIndex)}
                onTotalUpdate={(total) => updateEstimateTotal(estimateIndex, total)}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addEstimate}
              className="w-full"
              disabled={estimateDetails.estimates.length >= 3}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Estimate Option {estimateDetails.estimates.length >= 3 && "(Maximum 3)"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
