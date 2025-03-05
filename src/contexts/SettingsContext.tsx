
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type Company = {
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
};

interface SettingsContextType {
  company: Company | null;
  loading: boolean;
  fetchCompanyDetails: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setCompany(data as Company);
    } catch (error) {
      console.error("Error fetching company details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  return (
    <SettingsContext.Provider value={{ company, loading, fetchCompanyDetails }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
