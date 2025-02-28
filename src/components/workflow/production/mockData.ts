
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";

// Mock data for demonstration
export const mockEvents: ScheduledEvent[] = [
  {
    id: "evt-2",
    estimateId: "est-002",
    name: "Corporate Event - Annual Meeting",
    date: "2024-05-20",
    startTime: "09:00",
    endTime: "17:00",
    location: "Hyatt Regency, Delhi",
    clientName: "Tech Solutions Ltd",
    clientPhone: "+91 99999 88888",
    clientEmail: "events@techsolutions.com",
    photographersCount: 1,
    videographersCount: 2,
    stage: "production",
    clientRequirements: "Need high-quality photos of all executive speakers and candid shots of audience engagement. Video should capture all presentations with clear audio.",
    assignments: [
      {
        teamMemberId: "tm-1",
        status: "accepted",
        notes: "Will handle all photography"
      },
      {
        teamMemberId: "tm-2",
        status: "accepted",
        notes: "Primary videographer"
      }
    ],
    timeTracking: [
      {
        teamMemberId: "tm-2",
        hoursLogged: 4,
        date: "2024-05-20"
      }
    ]
  },
  {
    id: "evt-3",
    estimateId: "est-003",
    name: "Product Launch - Smartphone XYZ",
    date: new Date().toISOString().split('T')[0], // Today's date
    startTime: "14:00",
    endTime: "18:00",
    location: "Grand Hotel, Mumbai",
    clientName: "Mobile Innovations",
    clientPhone: "+91 88888 77777",
    clientEmail: "marketing@mobileinnovations.com",
    photographersCount: 2,
    videographersCount: 1,
    stage: "production",
    assignments: [
      {
        teamMemberId: "tm-1",
        status: "accepted",
        notes: "Product shots and stage photos"
      }
    ],
    timeTracking: []
  }
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: "tm-1",
    name: "Ankit Patel",
    role: "photographer",
    email: "ankit@example.com",
    phone: "+91 98765 00001",
    whatsapp: "+91 98765 00001",
    availability: {
      "2024-05-20": "busy",
      "2024-05-21": "available",
      "2024-05-22": "available"
    }
  },
  {
    id: "tm-2",
    name: "Priya Singh",
    role: "videographer",
    email: "priya@example.com",
    phone: "+91 98765 00002",
    availability: {
      "2024-05-20": "busy",
      "2024-05-21": "busy",
      "2024-05-22": "available"
    }
  },
  {
    id: "tm-3",
    name: "Rahul Sharma",
    role: "photographer",
    email: "rahul@example.com",
    phone: "+91 98765 00003",
    availability: {
      "2024-05-20": "available",
      "2024-05-21": "available",
      "2024-05-22": "busy"
    }
  }
];
