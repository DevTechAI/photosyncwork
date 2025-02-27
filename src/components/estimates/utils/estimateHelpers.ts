
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
  
  // Validate each estimate package
  for (let i = 0; i < estimates.length; i++) {
    const estimate = estimates[i];
    
    // Check if services are provided
    if (!estimate.services || estimate.services.length === 0) {
      toast({
        title: "Incomplete Package",
        description: `Package option ${i + 1} has no events. Please add at least one event.`,
        variant: "destructive",
      });
      return null;
    }
    
    // Check if each service has all required fields
    for (let j = 0; j < estimate.services.length; j++) {
      const service = estimate.services[j];
      if (!service.event || !service.date) {
        toast({
          title: "Incomplete Event",
          description: `Please fill in all required event details in package ${i + 1}.`,
          variant: "destructive",
        });
        return null;
      }
    }
    
    // Check if total is provided
    if (!estimate.total) {
      toast({
        title: "Missing Total",
        description: `Please provide a total amount for package option ${i + 1}.`,
        variant: "destructive",
      });
      return null;
    }
    
    // Check if deliverables are provided
    if (!estimate.deliverables || estimate.deliverables.length === 0 || 
        estimate.deliverables.some(d => !d)) {
      toast({
        title: "Incomplete Deliverables",
        description: `Please ensure all deliverables in package ${i + 1} are properly filled.`,
        variant: "destructive",
      });
      return null;
    }
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
    clientEmail: formData.clientEmail || "", // Include clientEmail in the preview data
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
