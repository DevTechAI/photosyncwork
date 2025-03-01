
import { Card } from "@/components/ui/card";

interface Service {
  title: string;
  items: string[];
}

const services: Record<string, Service> = {
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
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-light">SERVICES</h2>
        {!isReadOnly && (
          <p className="text-sm text-muted-foreground mt-2">
            (Optional) These services will be displayed in the final estimate sent to the client
          </p>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {Object.entries(services).map(([key, service]) => (
          <Card key={key} className="p-6 space-y-4">
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
