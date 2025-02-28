
export type TeamMemberRole = "photographer" | "videographer" | "editor" | "production" | "album_designer";

export type WorkflowStage = "pre-production" | "production" | "post-production" | "completed";

export interface TeamMember {
  id: string;
  name: string;
  role: TeamMemberRole;
  email: string;
  phone: string;
  whatsapp?: string;
  availability: {
    [date: string]: "available" | "busy" | "tentative";
  };
  isFreelancer?: boolean;
}

export interface EventAssignment {
  eventId: string;
  eventName: string;
  date: string;
  location: string;
  teamMemberId: string;
  status: "pending" | "accepted" | "declined" | "reassigned";
  notes?: string;
  reportingTime?: string;
}

export interface ScheduledEvent {
  id: string;
  estimateId: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  guestCount?: string;
  photographersCount: number;
  videographersCount: number;
  assignments: EventAssignment[];
  notes?: string;
  stage: WorkflowStage;
  clientRequirements?: string;
  references?: string[];
  timeTracking?: {
    teamMemberId: string;
    hoursLogged: number;
    date: string;
  }[];
  deliverables?: {
    id: string;
    type: "photos" | "videos" | "album";
    status: "pending" | "in-progress" | "delivered" | "revision-requested" | "completed";
    assignedTo?: string;
    deliveryDate?: string;
    revisionNotes?: string;
    completedDate?: string;
  }[];
  dataCopied?: boolean;
  estimatePackage?: string;
}

export interface DeliverableAssignment {
  id: string;
  eventId: string;
  deliverableId: string;
  teamMemberId: string;
  deadline: string;
  status: "pending" | "in-progress" | "completed";
  notes?: string;
}
