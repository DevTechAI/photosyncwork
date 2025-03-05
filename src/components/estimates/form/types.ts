
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
  selectedPackageIndex?: number; // Added to track which package was approved
  [key: string]: any;
}
