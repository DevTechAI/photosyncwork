
import { ScheduledEvent, TeamMember } from "@/components/scheduling/types";

// Mock team members with editor roles
export const mockTeamMembers: TeamMember[] = [
  {
    id: "tm-4",
    name: "Vikram Joshi",
    role: "editor",
    email: "vikram@example.com",
    phone: "+91 98765 00004",
    availability: {
      "2023-05-20": "available",
      "2023-05-21": "available",
      "2023-05-22": "available"
    }
  },
  {
    id: "tm-5",
    name: "Divya Sharma",
    role: "editor",
    email: "divya@example.com",
    phone: "+91 98765 00005",
    availability: {
      "2023-05-20": "busy",
      "2023-05-21": "available",
      "2023-05-22": "available"
    }
  },
  {
    id: "tm-6",
    name: "Rahul Verma",
    role: "album_designer",
    email: "rahul@example.com",
    phone: "+91 98765 00006",
    availability: {
      "2023-05-20": "available",
      "2023-05-21": "available",
      "2023-05-22": "busy"
    }
  }
];
