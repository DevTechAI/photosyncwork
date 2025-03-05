
import { ScheduledEvent, EventAssignment } from "@/components/scheduling/types";
import { Json } from "@/integrations/supabase/types";

// Convert Supabase database record to frontend ScheduledEvent model
export function dbToScheduledEvent(dbRecord: any): ScheduledEvent {
  return {
    id: dbRecord.id,
    estimateId: dbRecord.estimateid,
    name: dbRecord.name,
    date: dbRecord.date,
    startTime: dbRecord.starttime,
    endTime: dbRecord.endtime,
    location: dbRecord.location,
    clientName: dbRecord.clientname,
    clientPhone: dbRecord.clientphone,
    clientEmail: dbRecord.clientemail || "",
    guestCount: dbRecord.guestcount,
    photographersCount: dbRecord.photographerscount,
    videographersCount: dbRecord.videographerscount,
    assignments: Array.isArray(dbRecord.assignments) 
      ? dbRecord.assignments 
      : typeof dbRecord.assignments === 'string'
        ? JSON.parse(dbRecord.assignments)
        : [],
    notes: dbRecord.notes,
    stage: dbRecord.stage,
    clientRequirements: dbRecord.clientrequirements,
    references: dbRecord.reference_images,
    timeTracking: dbRecord.timetracking,
    deliverables: Array.isArray(dbRecord.deliverables)
      ? dbRecord.deliverables
      : typeof dbRecord.deliverables === 'string'
        ? JSON.parse(dbRecord.deliverables)
        : [],
    dataCopied: dbRecord.datacopied,
    estimatePackage: dbRecord.estimatepackage
  };
}

// Convert frontend ScheduledEvent model to Supabase database record
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
    estimatepackage: event.estimatePackage
  };
}
