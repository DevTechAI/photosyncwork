
import { Toast } from "@/components/ui/toast";

export function generatePreviewEstimate(formData: any, toast: any) {
  // Get the first estimate for preview (typically there's just one)
  const firstEstimate = formData.estimateDetails.estimates[0];
  
  if (!firstEstimate) {
    toast({
      title: "Missing Information",
      description: "Please add at least one estimate option with services.",
      variant: "destructive",
    });
    return null;
  }
  
  const previewData = {
    id: Math.floor(Math.random() * 10000).toString(),
    clientName: formData.clientName,
    date: new Date().toISOString(),
    amount: firstEstimate.total,
    status: "pending",
    services: firstEstimate.services.map((service: any) => ({
      event: service.event,
      date: service.date,
      photographers: service.photographers,
      cinematographers: service.cinematographers
    })),
    deliverables: firstEstimate.deliverables
  };
  
  return previewData;
}
