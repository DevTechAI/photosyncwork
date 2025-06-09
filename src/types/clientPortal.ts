
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

export interface ClientFeedback {
  id: string;
  eventId: string;
  deliverableId?: string;
  feedbackText?: string;
  status: 'pending' | 'approved' | 'revision_requested';
  createdAt: string;
  updatedAt: string;
}

export interface ClientPortalData {
  access: ClientPortalAccess;
  deliverables: ClientDeliverable[];
  feedback: ClientFeedback[];
  eventDetails?: {
    name: string;
    date: string;
    location: string;
  };
}
