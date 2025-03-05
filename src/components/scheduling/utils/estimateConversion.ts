
/**
 * Main entry point for estimate conversion functionality
 * This file now serves as a facade for the refactored functionality
 */

// Export the main function directly from its new location
export { createEventsFromApprovedEstimates } from './estimateToEventConverter';

// Also export the helper functions for direct access if needed
export { getApprovedEstimates } from './approvedEstimatesLoader';
export { checkEventExistsForEstimateEvent } from './eventExistenceChecker';
export { createScheduledEventFromEstimateEvent } from './eventCreator';
