
export type TeamMemberRole = "photographer" | "videographer" | "editor" | "production";

export type WorkflowStage = "pre-production" | "production" | "post-production";

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
}

export interface EventAssignment {
  eventId: string;
  eventName: string;
  date: string;
  location: string;
  teamMemberId: string;
  status: "pending" | "accepted" | "declined" | "reassigned";
  notes?: string;
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
    type: "photos" | "videos" | "album";
    status: "pending" | "in-progress" | "delivered" | "revision-requested" | "completed";
    assignedTo?: string;
    deliveryDate?: string;
  }[];
}
