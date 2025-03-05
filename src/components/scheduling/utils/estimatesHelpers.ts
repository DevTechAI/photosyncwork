
/**
 * Retrieves approved estimates from localStorage
 */
export const getApprovedEstimates = () => {
  const savedEstimates = localStorage.getItem("estimates");
  if (!savedEstimates) return [];
  
  const estimates = JSON.parse(savedEstimates);
  // Filter only approved estimates
  return estimates.filter(estimate => estimate.status === "approved");
};

/**
 * Creates a partial event object from an approved estimate
 */
export function createEventFromEstimate(estimate) {
  console.log("Creating event from estimate:", estimate);
  
  // Initialize event data with client info
  const eventData = {
    clientName: estimate.clientName || "",
    clientEmail: estimate.clientEmail || "",
    clientPhone: estimate.clientPhone || "",
    name: "",
    date: "",
    // Default values for required fields
    photographersCount: 1,
    videographersCount: 0,
    guestCount: "0",
    estimatePackage: "",
    deliverables: []
  };
  
  // Check if the estimate has packages and a selected package index
  if (estimate.packages && estimate.packages.length > 0 && estimate.selectedPackageIndex !== undefined) {
    // Use the specifically selected package
    const selectedPackage = estimate.packages[estimate.selectedPackageIndex];
    
    console.log("Using selected package:", selectedPackage);
    
    // Extract services from the selected package
    if (selectedPackage && selectedPackage.services && selectedPackage.services.length > 0) {
      // Use the first service event for the initial event
      const firstService = selectedPackage.services[0];
      
      console.log("Using first service:", firstService);
      
      // Add the event name and date from the service
      eventData.name = firstService.event || "";
      eventData.date = firstService.date || "";
      eventData.photographersCount = parseInt(firstService.photographers) || 1;
      eventData.videographersCount = parseInt(firstService.cinematographers) || 0;
      eventData.guestCount = firstService.guests || "0";
    }
    
    // Extract deliverables from the selected package
    if (selectedPackage && selectedPackage.deliverables) {
      // Handle both array deliverables and the circular reference case
      const deliverablesArray = Array.isArray(selectedPackage.deliverables) 
        ? selectedPackage.deliverables 
        : estimate.deliverables || [];
      
      console.log("Using deliverables:", deliverablesArray);
      
      // Map deliverables to the required format
      eventData.deliverables = deliverablesArray.map((item, index) => ({
        id: `del-${Date.now()}-${index}`,
        type: typeof item === 'string' && item.toLowerCase().includes('photo') ? 'photos' : 
              typeof item === 'string' && item.toLowerCase().includes('video') ? 'videos' : 
              typeof item === 'string' && item.toLowerCase().includes('album') ? 'album' : 'photos',
        status: 'pending'
      }));
    }
    
    // Store package name/option for reference
    eventData.estimatePackage = selectedPackage.name || `Package Option ${estimate.selectedPackageIndex + 1}: ${selectedPackage.amount}`;
  } else if (estimate.services && estimate.services.length > 0) {
    // Legacy format - no packages, use services directly
    const firstService = estimate.services[0];
    
    console.log("Using legacy format service:", firstService);
    
    // Add the event name and date from the service
    eventData.name = firstService.event || "";
    eventData.date = firstService.date || "";
    eventData.photographersCount = parseInt(firstService.photographers) || 1;
    eventData.videographersCount = parseInt(firstService.cinematographers) || 0;
    eventData.guestCount = firstService.guests || "0";
    
    // Extract deliverables from main estimate
    if (estimate.deliverables && Array.isArray(estimate.deliverables)) {
      eventData.deliverables = estimate.deliverables.map((item, index) => ({
        id: `del-${Date.now()}-${index}`,
        type: typeof item === 'string' && item.toLowerCase().includes('photo') ? 'photos' : 
              typeof item === 'string' && item.toLowerCase().includes('video') ? 'videos' : 
              typeof item === 'string' && item.toLowerCase().includes('album') ? 'album' : 'photos',
        status: 'pending'
      }));
    }
    
    eventData.estimatePackage = `Standard Package: ${estimate.amount}`;
  }
  
  console.log("Final event data created:", eventData);
  return eventData;
}
