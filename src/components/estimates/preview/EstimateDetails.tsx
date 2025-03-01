import { useEffect, useState } from "react";
import { CustomService } from "../form/types";
import { services as defaultServices } from "../pages/ServicesPage";
import { supabase } from "@/integrations/supabase/client";

interface EstimateDetailsProps {
  estimate: any;
}

export function EstimateDetails({ estimate }: EstimateDetailsProps) {
  const [customServices, setCustomServices] = useState<Record<string, CustomService>>(defaultServices);

  useEffect(() => {
    const loadCustomServices = async () => {
      try {
        // Try to load from Supabase first
        const { data, error } = await supabase
          .from('settings')
          .select('settings')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error loading settings:", error);
          throw error;
        }

        if (data && data.settings && typeof data.settings === 'object') {
          // Check if services exist in the settings object
          const settingsObj = data.settings as { services?: Record<string, CustomService> };
          if (settingsObj.services) {
            setCustomServices(settingsObj.services);
          }
        } else {
          // Fall back to localStorage
          const savedSettings = localStorage.getItem("studiosync_settings");
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            if (parsedSettings.services) {
              setCustomServices(parsedSettings.services);
            }
          }
        }
      } catch (error) {
        console.error("Error loading custom services:", error);
      }
    };

    loadCustomServices();
  }, []);

  // Since we don't have the full file, we'll return a minimal component
  // that showcases the structure but will be replaced when loaded from the real file
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Estimate Details</h2>
      
      {/* Placeholder for the actual content */}
      <div>
        <p>Client: {estimate.clientName}</p>
        <p>Amount: {estimate.amount}</p>
        <p>Status: {estimate.status}</p>
      </div>
    </div>
  );
}
