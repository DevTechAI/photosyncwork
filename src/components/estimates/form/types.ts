
export interface EstimateFormData {
  clientName: string;
  clientEmail: string;
  selectedServices: string[];
  estimateDetails: {
    events: any[];
    estimates: any[];
    deliverables: string[];
  };
  terms: string[];
}

export interface PreviewEstimate {
  id?: string;
  status?: string;
  clientName: string;
  clientEmail?: string;
  [key: string]: any;
}

export interface SettingsData {
  terms: string[];
  services: Record<string, CustomService>;
  companyIntro: string;
}

export interface CustomService {
  title: string;
  items: string[];
}
