
import { EventAssignment, ScheduledEvent, TeamMember } from "../types";
import { useToast } from "@/components/ui/use-toast";

export function createAssignmentMessage(event: ScheduledEvent, assignment: EventAssignment, teamMember: TeamMember): string {
  const eventDate = new Date(event.date).toLocaleDateString();
  const reportingTime = assignment.reportingTime || event.startTime;
  
  return `
Hello ${teamMember.name},

You have been assigned to cover the following event:

Event: ${event.name}
Date: ${eventDate}
Time: ${reportingTime} - ${event.endTime}
Location: ${event.location}
Client: ${event.clientName}

${event.clientRequirements ? `\nClient Requirements:\n${event.clientRequirements}` : ''}

Please confirm your availability by accepting or declining this assignment.

Thank you,
StudioSync Team
  `;
}

export function createReminderMessage(event: ScheduledEvent, assignment: EventAssignment, teamMember: TeamMember): string {
  const eventDate = new Date(event.date).toLocaleDateString();
  const reportingTime = assignment.reportingTime || event.startTime;
  
  return `
REMINDER: Event Tomorrow

Hello ${teamMember.name},

This is a reminder for your assignment tomorrow:

Event: ${event.name}
Date: ${eventDate}
Reporting Time: ${reportingTime}
Location: ${event.location}
Client: ${event.clientName}
Approximate Guest Count: ${event.guestCount || 'Not specified'}

${event.clientRequirements ? `\nClient Requirements:\n${event.clientRequirements}` : ''}

Please ensure you arrive on time with all necessary equipment.

Thank you,
StudioSync Team
  `;
}

export function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
  // In a real implementation, this would connect to the WhatsApp Business API
  // For demo purposes, we'll simulate success
  console.log(`Sending WhatsApp message to ${phoneNumber}:`);
  console.log(message);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

export function useTeamNotifications() {
  const { toast } = useToast();
  
  const sendAssignmentNotification = async (
    event: ScheduledEvent, 
    assignment: EventAssignment, 
    teamMember: TeamMember
  ) => {
    try {
      const message = createAssignmentMessage(event, assignment, teamMember);
      const phoneNumber = teamMember.whatsapp || teamMember.phone;
      
      await sendWhatsAppMessage(phoneNumber, message);
      
      toast({
        title: "Assignment Notification Sent",
        description: `Assignment notification sent to ${teamMember.name} via WhatsApp`,
      });
      
      return true;
    } catch (error) {
      console.error("Error sending assignment notification:", error);
      
      toast({
        title: "Notification Failed",
        description: "Failed to send assignment notification. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  const sendReminderNotification = async (
    event: ScheduledEvent, 
    assignment: EventAssignment, 
    teamMember: TeamMember
  ) => {
    try {
      const message = createReminderMessage(event, assignment, teamMember);
      const phoneNumber = teamMember.whatsapp || teamMember.phone;
      
      await sendWhatsAppMessage(phoneNumber, message);
      
      toast({
        title: "Reminder Sent",
        description: `Event reminder sent to ${teamMember.name} via WhatsApp`,
      });
      
      return true;
    } catch (error) {
      console.error("Error sending reminder notification:", error);
      
      toast({
        title: "Reminder Failed",
        description: "Failed to send event reminder. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  return {
    sendAssignmentNotification,
    sendReminderNotification
  };
}
