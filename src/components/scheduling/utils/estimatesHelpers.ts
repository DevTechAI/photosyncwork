
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
  // Initialize event data with client info
  const eventData = {
    clientName: estimate.clientName || "",
    clientEmail: estimate.clientEmail || "",
    name: "",
    date: "",
    // Default values for required fields
    photographersCount: 1,
    videographersCount: 1,
    estimatePackage: "",
    deliverables: []
  };
  
  // Check if the estimate has packages
  if (estimate.packages && estimate.packages.length > 0) {
    // Use the first package for now (in real app, might want to let user choose)
    const selectedPackage = estimate.packages[0];
    
    // Extract services from the selected package
    if (selectedPackage.services && selectedPackage.services.length > 0) {
      // Use the first service event for the initial event
      const firstService = selectedPackage.services[0];
      
      // Add the event name and date from the service
      eventData.name = firstService.event || "";
      eventData.date = firstService.date || "";
      eventData.photographersCount = parseInt(firstService.photographers) || 1;
      eventData.videographersCount = parseInt(firstService.cinematographers) || 1;
    }
    
    // Extract deliverables
    if (selectedPackage.deliverables && selectedPackage.deliverables.length > 0) {
      // Map deliverables to the required format
      eventData.deliverables = selectedPackage.deliverables.map((item, index) => ({
        id: `del-${Date.now()}-${index}`,
        type: item.toLowerCase().includes('photo') ? 'photos' : 
              item.toLowerCase().includes('video') ? 'videos' : 
              item.toLowerCase().includes('album') ? 'album' : 'photos',
        status: 'pending'
      }));
    }
    
    // Store package name/option for reference
    eventData.estimatePackage = selectedPackage.name || `Package Option 1: ${selectedPackage.amount}`;
  } else if (estimate.services && estimate.services.length > 0) {
    // Legacy format - no packages, use services directly
    const firstService = estimate.services[0];
    
    // Add the event name and date from the service
    eventData.name = firstService.event || "";
    eventData.date = firstService.date || "";
    eventData.photographersCount = parseInt(firstService.photographers) || 1;
    eventData.videographersCount = parseInt(firstService.cinematographers) || 1;
    
    // Extract deliverables from main estimate
    if (estimate.deliverables && estimate.deliverables.length > 0) {
      eventData.deliverables = estimate.deliverables.map((item, index) => ({
        id: `del-${Date.now()}-${index}`,
        type: item.toLowerCase().includes('photo') ? 'photos' : 
              item.toLowerCase().includes('video') ? 'videos' : 
              item.toLowerCase().includes('album') ? 'album' : 'photos',
        status: 'pending'
      }));
    }
    
    eventData.estimatePackage = `Standard Package: ${estimate.amount}`;
  }
  
  return eventData;
}
