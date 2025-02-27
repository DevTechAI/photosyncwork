import { Toast } from "@/components/ui/toast";

export function generatePreviewEstimate(formData: any, toast: any) {
  const estimates = formData.estimateDetails.estimates;
  
  if (!estimates || estimates.length === 0) {
    toast({
      title: "Missing Information",
      description: "Please add at least one estimate option with services.",
      variant: "destructive",
    });
    return null;
  }
  
  // Create packages array from all estimates
  const packages = estimates.map((estimate, index) => ({
    name: `Option ${index + 1}`,
    amount: estimate.total,
    services: estimate.services.map((service: any) => ({
      event: service.event,
      date: service.date,
      photographers: service.photographers,
      cinematographers: service.cinematographers
    })),
    deliverables: estimate.deliverables
  }));
  
  const previewData = {
    id: Math.floor(Math.random() * 10000).toString(),
    clientName: formData.clientName,
    date: new Date().toISOString(),
    // Still keep the first estimate's amount as the main amount for compatibility
    amount: estimates[0].total,
    status: "pending",
    // Keep the first estimate's services and deliverables for backward compatibility
    services: estimates[0].services.map((service: any) => ({
      event: service.event,
      date: service.date,
      photographers: service.photographers,
      cinematographers: service.cinematographers
    })),
    deliverables: estimates[0].deliverables,
    // Add the new packages array with all estimate options
    packages: packages
  };
  
  return previewData;
}
