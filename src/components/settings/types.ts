
export interface Company {
  id?: string;
  name: string;
  gst_number?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  email?: string;
  phone?: string;
  logo_url?: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  whatsapp?: string;
  is_freelancer?: boolean;
  availability?: Record<string, string>;
}

export interface Vendor {
  id?: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  gst_number?: string;
  address?: string;
  service_type?: string;
  notes?: string;
}
