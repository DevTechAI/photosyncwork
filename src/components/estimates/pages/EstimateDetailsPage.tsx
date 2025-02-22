
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface Event {
  name: string;
  date: string;
  location: string;
  people: string;
}

interface EstimateDetails {
  events: Event[];
  deliverables: string[];
}

interface EstimateDetailsPageProps {
  estimateDetails: EstimateDetails;
  onDetailsChange: (details: EstimateDetails) => void;
}

export function EstimateDetailsPage({ estimateDetails, onDetailsChange }: EstimateDetailsPageProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-light">ESTIMATE I</h2>
        <p className="text-sm text-muted-foreground">as per your requirement</p>
        
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Events Coverage</h3>
              <div className="space-y-4">
                {/* Event details form fields would go here */}
                <p className="text-sm text-muted-foreground">
                  Candid Photography & Cinematography (All events)
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Deliverables</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Curated online Gallery with 400+ images</li>
                <li>1200+ Processed Images in hard drive (provided by you)</li>
                <li>20-90 min Documentary film of all events Individually, delivered online for you to download</li>
                <li>Wedding film 8-12mins (with live audio & Audio bytes) - delivered online with password protection</li>
                <li>Live streaming for Wedding event only - Complimentary</li>
                <li>Customised 35 Sheet Album - 2 Copies</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
