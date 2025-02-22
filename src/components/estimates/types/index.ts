
export interface Service {
  event: string;
  date: string;
  photographers: string;
  cinematographers: string;
}

export interface Event {
  name: string;
  date: string;
  location: string;
  people: string;
}

export interface Estimate {
  services: Service[];
  total: string;
  deliverables: string[];
}

export interface EstimateDetails {
  events: Event[];
  estimates: Estimate[];
  deliverables: string[];
}

export const EVENT_OPTIONS = [
  'Engagement',
  'Haldi',
  'Mehendi',
  'Sangeeth',
  'Lagnapatrika',
  'Wedding',
  'Pellikthuru',
  'Pellikoduku',
  'Reception'
] as const;
