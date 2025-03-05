
/**
 * Utilities for loading and retrieving approved estimates
 */

/**
 * Retrieves all approved estimates from local storage with improved error handling
 * @returns Promise that resolves to an array of approved estimates
 */
export async function getApprovedEstimates(): Promise<any[]> {
  try {
    console.log("Retrieving approved estimates from localStorage");
    
    // Simulate async operation for future compatibility with remote storage
    const savedEstimates = await Promise.resolve(localStorage.getItem("estimates"));
    
    if (!savedEstimates) {
      console.log("No estimates found in localStorage");
      return [];
    }
    
    // Parse the JSON data with error handling
    let allEstimates;
    try {
      allEstimates = JSON.parse(savedEstimates);
    } catch (parseError) {
      console.error('Error parsing estimates JSON:', parseError);
      throw new Error('Invalid estimates data format in storage');
    }
    
    if (!Array.isArray(allEstimates)) {
      console.error('Estimates data is not an array');
      throw new Error('Estimates data has invalid format (not an array)');
    }
    
    console.log("All estimates from localStorage:", allEstimates);
    
    // Filter for approved estimates
    const approvedEstimates = allEstimates.filter((estimate: any) => {
      if (!estimate || typeof estimate !== 'object') {
        console.warn('Found invalid estimate entry:', estimate);
        return false;
      }
      return estimate.status === "approved";
    });
    
    console.log("Filtered approved estimates:", approvedEstimates);
    return approvedEstimates;
  } catch (error) {
    console.error('Error retrieving approved estimates:', error);
    // Rethrow with more context to help with debugging
    throw new Error(`Failed to retrieve approved estimates: ${error instanceof Error ? error.message : String(error)}`);
  }
}
