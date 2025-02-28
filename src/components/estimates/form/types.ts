
export interface EstimateFormData {
  clientName: string;
  clientEmail: string;
  selectedServices: string[];
  estimateDetails: {
    events: any[];
    estimates: any[];
    deliverables: string[];
  };
}

export interface PreviewEstimate {
  id?: string;
  status?: string;
  clientName: string;
  clientEmail?: string;
  [key: string]: any;
}
