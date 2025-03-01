
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { CustomService } from "../form/types";
import { Database } from "@/integrations/supabase/types";

// Default services as fallback
export const services: Record<string, CustomService> = {
  bigFat: {
    title: "BigFat Weddings",
    items: [
      "Candid Photography",
      "Cinematography",
      "Traditional Photography",
      "Traditional Videography",
      "Premium Albums",
      "Cloud Gallery"
    ]
  },
  intimate: {
    title: "Intimate Weddings",
    items: [
      "Candid Photography",
      "Cinematography",
      "Cloud Gallery"
    ]
  },
  addons: {
    title: "Optional Addons",
    items: [
      "Evite (E-invitations) - starts from 2,000/-",
      "LED Screen 25,000/-",
      "Live Streaming HD - 15,000/-",
      "Traditional Video coverage - 30,000/- Per Day",
      "Traditional Photo - 20,000/- Per Day",
      "Albums - 25,000/- (35-40 sheets)"
    ]
  }
};

interface ServicesPageProps {
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  isReadOnly?: boolean;
}

export function ServicesPage({ selectedServices, onServicesChange, isReadOnly = false }: ServicesPageProps) {
  const [customServices, setCustomServices] = useState<Record<string, CustomService>>(services);
  const [isLoading, setIsLoading] = useState(true);

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
        // Keep using the default services defined above
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomServices();
  }, []);

  const handleToggleService = (serviceKey: string) => {
    if (selectedServices.includes(serviceKey)) {
      onServicesChange(selectedServices.filter(s => s !== serviceKey));
    } else {
      onServicesChange([...selectedServices, serviceKey]);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading services...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-light">SERVICES</h2>
        {!isReadOnly && (
          <p className="text-sm text-muted-foreground mt-2">
            (Optional) Select service packages to include in your estimate. This page will always be displayed in the final estimate.
          </p>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {Object.entries(customServices).map(([key, service]) => (
          <Card key={key} className="p-6 space-y-4 relative">
            {!isReadOnly && (
              <div className="absolute right-4 top-4">
                <Checkbox 
                  checked={selectedServices.includes(key)}
                  onCheckedChange={() => handleToggleService(key)}
                  id={`service-${key}`}
                />
              </div>
            )}
            <h3 className="text-xl font-medium">{service.title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {service.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>TailorMade - Customised as per clients requirement</p>
      </div>
    </div>
  );
}
