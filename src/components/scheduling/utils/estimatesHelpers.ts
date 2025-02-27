
import { Client } from "@/components/clients/mockClients";
import { ScheduledEvent } from "../types";

interface Estimate {
  id: string;
  clientName: string;
  clientEmail?: string;
  date: string;
  amount: string;
  status: string;
  services?: Array<{
    event: string;
    date: string;
    photographers: string;
    cinematographers: string;
  }>;
  deliverables?: string[];
  packages?: Array<{
    name?: string;
    amount: string;
    services: Array<{
      event: string;
      date: string;
      photographers: string;
      cinematographers: string;
    }>;
    deliverables: string[];
  }>;
}

export function getApprovedEstimates(): Estimate[] {
  const savedEstimates = localStorage.getItem("estimates");
  if (!savedEstimates) return [];
  
  try {
    const allEstimates = JSON.parse(savedEstimates);
    return allEstimates.filter((estimate: Estimate) => estimate.status === "approved");
  } catch (error) {
    console.error("Error parsing saved estimates:", error);
    return [];
  }
}

export function getClientByName(clientName: string): Client | null {
  // This would typically be a database call in a real app
  // For now, we'll import from our mock data
  const { clients } = require("@/components/clients/mockClients");
  
  return clients.find((client: Client) => client.name === clientName) || null;
}

export function createEventFromEstimate(estimate: Estimate): Partial<ScheduledEvent> {
  // Determine which services to use (from direct services or first package)
  const services = estimate.services || 
    (estimate.packages && estimate.packages.length > 0 ? estimate.packages[0].services : []);
    
  // Find the earliest event date to use as the project start date
  let earliestDate = new Date();
  if (services && services.length > 0) {
    services.forEach(service => {
      const serviceDate = new Date(service.date);
      if (serviceDate < earliestDate) {
        earliestDate = serviceDate;
      }
    });
  }
  
  // Get client contact information
  const client = getClientByName(estimate.clientName);
  
  // Count total photographers and videographers
  const photographersCount = services.reduce((total, service) => {
    return total + (parseInt(service.photographers) || 0);
  }, 0);
  
  const videographersCount = services.reduce((total, service) => {
    return total + (parseInt(service.cinematographers) || 0);
  }, 0);
  
  // Create and map deliverables properly
  const processDeliverables = () => {
    const rawDeliverables = estimate.deliverables || 
      (estimate.packages && estimate.packages.length > 0 ? estimate.packages[0].deliverables : []);
      
    return rawDeliverables.map(d => ({ 
      type: determineDeliverableType(d), 
      status: "pending" as const
    }));
  };
  
  // Create event object
  return {
    estimateId: estimate.id,
    name: `${estimate.clientName} Project`,
    date: earliestDate.toISOString().split('T')[0],
    location: "",
    clientName: estimate.clientName,
    clientPhone: client?.contact.phone || "",
    photographersCount: photographersCount > 0 ? photographersCount : 1,
    videographersCount: videographersCount > 0 ? videographersCount : 1,
    stage: "pre-production",
    clientRequirements: services.map(s => s.event).join(", "),
    deliverables: processDeliverables()
  };
}

function determineDeliverableType(deliverable: string): "photos" | "videos" | "album" {
  const deliverableLower = deliverable.toLowerCase();
  if (deliverableLower.includes("video") || deliverableLower.includes("film")) {
    return "videos";
  } else if (deliverableLower.includes("album")) {
    return "album";
  } else {
    // Default to photos for anything else
    return "photos";
  }
}
