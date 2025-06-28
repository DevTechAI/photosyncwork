/**
 * Client Portal Access represents the authentication and access control
 * for a specific client to view their deliverables
 */
export interface ClientPortalAccess {
  id: string;
  eventId: string;
  accessCode: string;
  clientName: string;
  clientEmail?: string;
  passwordHash?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Client Deliverable represents a file that has been delivered to a client
 * through the client portal
 */
export interface ClientDeliverable {
  id: string;
  eventId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  isApproved: boolean;
  isWatermarked: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Client Feedback represents feedback provided by a client on deliverables
 * or the overall project
 */
export interface ClientFeedback {
  id: string;
  eventId: string;
  deliverableId?: string;
  feedbackText?: string;
  status: 'approved' | 'revision_requested' | 'pending';
  createdAt: string;
  updatedAt: string;
}

/**
 * Event Details represents basic information about the event
 * that is shared with the client
 */
export interface EventDetails {
  name: string;
  date: string;
  location: string;
}

/**
 * Client Portal Data represents all the data needed to render
 * the client portal for a specific client
 */
export interface ClientPortalData {
  access: ClientPortalAccess;
  deliverables: ClientDeliverable[];
  feedback: ClientFeedback[];
  eventDetails?: EventDetails;
}

/**
 * Feedback Submission represents the data sent when a client
 * submits feedback on deliverables
 */
export interface FeedbackSubmission {
  deliverableId?: string;
  feedbackText: string;
  status: 'approved' | 'revision_requested';
}