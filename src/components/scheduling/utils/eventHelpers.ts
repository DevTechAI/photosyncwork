
// This file now serves as a central export point for event-related utilities
// Import and re-export from the individual utility files
import { getAllEvents, getAllEventsFromLocalStorage, getEventsByStage } from './eventLoaders';
import { saveEvent, saveEvents, updateEventStage } from './eventPersistence';
import { createEventsFromApprovedEstimates } from './estimateConversion';

export {
  // Event loaders
  getAllEvents,
  getAllEventsFromLocalStorage,
  getEventsByStage,
  
  // Event persistence
  saveEvent,
  saveEvents,
  updateEventStage,
  
  // Estimate conversion
  createEventsFromApprovedEstimates
};
