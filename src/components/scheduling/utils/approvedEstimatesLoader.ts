
/**
 * Utilities for loading and retrieving approved estimates
 */

/**
 * Retrieves all approved estimates from local storage
 * @returns Array of approved estimates
 */
export function getApprovedEstimates(): any[] {
  try {
    const savedEstimates = localStorage.getItem("estimates");
    if (!savedEstimates) {
      console.log("No estimates found in localStorage");
      return [];
    }
    
    const allEstimates = JSON.parse(savedEstimates);
    console.log("All estimates from localStorage:", allEstimates);
    
    const approvedEstimates = allEstimates.filter((estimate: any) => estimate.status === "approved");
    console.log("Filtered approved estimates:", approvedEstimates);
    return approvedEstimates;
  } catch (error) {
    console.error('Error retrieving approved estimates:', error);
    return [];
  }
}
