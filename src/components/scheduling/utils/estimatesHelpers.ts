
// Get approved estimates from localStorage
export function getApprovedEstimates() {
  const savedEstimates = localStorage.getItem("estimates");
  if (!savedEstimates) return [];

  const estimates = JSON.parse(savedEstimates);
  return estimates.filter((estimate: any) => estimate.status === "approved");
}

// Process deliverables from an estimate
export function processDeliverables(estimate: any) {
  const deliverables = [] as const;
  
  if (!estimate.deliverables && !estimate.packages) {
    return deliverables;
  }
  
  // If estimate has packages, use the deliverables from the selected package
  // or first package by default
  if (estimate.packages && estimate.packages.length > 0) {
    const firstPackage = estimate.packages[0];
    
    if (firstPackage.deliverables && firstPackage.deliverables.length > 0) {
      return firstPackage.deliverables.map((deliverable: string, index: number) => ({
        id: `del-${index}-${Date.now()}`,
        type: deliverable.toLowerCase().includes("photo") ? "photos" :
              deliverable.toLowerCase().includes("video") || deliverable.toLowerCase().includes("film") ? "videos" :
              deliverable.toLowerCase().includes("album") ? "album" : "photos",
        status: "pending",
        deliveryDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days from now
      }));
    }
  }
  
  // Fallback to direct deliverables
  if (estimate.deliverables && estimate.deliverables.length > 0) {
    return estimate.deliverables.map((deliverable: string, index: number) => ({
      id: `del-${index}-${Date.now()}`,
      type: deliverable.toLowerCase().includes("photo") ? "photos" :
            deliverable.toLowerCase().includes("video") || deliverable.toLowerCase().includes("film") ? "videos" :
            deliverable.toLowerCase().includes("album") ? "album" : "photos",
      status: "pending",
      deliveryDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days from now
    }));
  }
  
  return deliverables;
}

// Create event data from an approved estimate
export function createEventFromEstimate(estimate: any) {
  // Find the first event service in the estimate
  let eventService = null;
  
  // Check if estimate has packages
  if (estimate.packages && estimate.packages.length > 0) {
    // Use the first package by default
    const firstPackage = estimate.packages[0];
    if (firstPackage.services && firstPackage.services.length > 0) {
      eventService = firstPackage.services[0];
    }
  } else if (estimate.services && estimate.services.length > 0) {
    // Fallback to direct services
    eventService = estimate.services[0];
  }
  
  // Get photographers and videographers count
  let photographersCount = 1;
  let videographersCount = 1;
  
  if (eventService) {
    photographersCount = eventService.photographers ? parseInt(eventService.photographers) || 1 : 1;
    videographersCount = eventService.cinematographers ? parseInt(eventService.cinematographers) || 1 : 1;
  }
  
  // Process deliverables
  const deliverables = processDeliverables(estimate);
  
  return {
    name: eventService ? eventService.event : "Event",
    date: eventService ? eventService.date : new Date().toISOString().split('T')[0],
    clientName: estimate.clientName,
    clientEmail: estimate.clientEmail || "",
    photographersCount,
    videographersCount,
    estimateId: estimate.id,
    deliverables,
    estimatePackage: estimate.packages && estimate.packages.length > 0 ? `Option 1: ${estimate.packages[0].amount}` : `Standard: ${estimate.amount}`
  };
}
