
import { ScheduledEvent, TeamMember, EventAssignment } from "@/components/scheduling/types";

// Convert database event to frontend ScheduledEvent
export function dbToScheduledEvent(dbEvent: any): ScheduledEvent {
  return {
    id: dbEvent.id,
    estimateId: dbEvent.estimateid || dbEvent.estimateId,
    name: dbEvent.name,
    date: dbEvent.date,
    startTime: dbEvent.starttime || dbEvent.startTime,
    endTime: dbEvent.endtime || dbEvent.endTime,
    location: dbEvent.location,
    clientName: dbEvent.clientname || dbEvent.clientName,
    clientPhone: dbEvent.clientphone || dbEvent.clientPhone || "",
    clientEmail: dbEvent.clientemail || dbEvent.clientEmail,
    guestCount: dbEvent.guestcount || dbEvent.guestCount || "0",
    photographersCount: dbEvent.photographerscount || dbEvent.photographersCount,
    videographersCount: dbEvent.videographerscount || dbEvent.videographersCount,
    assignments: dbEvent.assignments || [],
    notes: dbEvent.notes || "",
    stage: dbEvent.stage,
    clientRequirements: dbEvent.clientrequirements || dbEvent.clientRequirements || "",
    references: dbEvent.reference_images || dbEvent.references || [],
    timeTracking: dbEvent.timetracking || dbEvent.timeTracking || [],
    deliverables: dbEvent.deliverables || [],
    dataCopied: dbEvent.datacopied || dbEvent.dataCopied || false,
    estimatePackage: dbEvent.estimatepackage || dbEvent.estimatePackage,
    qualityCheck: dbEvent.qualityCheck || { _type: "undefined", value: "undefined" }
  };
}

// Convert frontend ScheduledEvent to database format
export function scheduledEventToDb(event: ScheduledEvent): any {
  return {
    id: event.id,
    estimateid: event.estimateId,
    name: event.name,
    date: event.date,
    starttime: event.startTime,
    endtime: event.endTime,
    location: event.location,
    clientname: event.clientName,
    clientphone: event.clientPhone,
    clientemail: event.clientEmail,
    guestcount: event.guestCount,
    photographerscount: event.photographersCount,
    videographerscount: event.videographersCount,
    assignments: event.assignments,
    notes: event.notes,
    stage: event.stage,
    clientrequirements: event.clientRequirements,
    reference_images: event.references,
    timetracking: event.timeTracking,
    deliverables: event.deliverables,
    datacopied: event.dataCopied,
    estimatepackage: event.estimatePackage,
    updated_at: new Date().toISOString()
  };
}

// Convert database team member to frontend TeamMember
export function dbToTeamMember(dbMember: any): TeamMember {
  return {
    id: dbMember.id,
    name: dbMember.name,
    role: dbMember.role,
    email: dbMember.email,
    phone: dbMember.phone,
    whatsapp: dbMember.whatsapp,
    availability: dbMember.availability || {},
    isFreelancer: dbMember.is_freelancer || dbMember.isFreelancer || false
  };
}

// Convert frontend TeamMember to database format
export function teamMemberToDb(member: TeamMember): any {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    email: member.email,
    phone: member.phone,
    whatsapp: member.whatsapp,
    availability: member.availability,
    is_freelancer: member.isFreelancer,
    updated_at: new Date().toISOString()
  };
}
