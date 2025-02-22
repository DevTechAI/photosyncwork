
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Service {
  description: string;
  amount: string;
}

interface Event {
  name: string;
  date: string;
  location: string;
  people: string;
}

interface Estimate {
  services: Service[];
  total: string;
}

interface EstimateDetails {
  events: Event[];
  estimates: Estimate[];
  deliverables: string[];
}

interface EstimateDetailsPageProps {
  estimateDetails: EstimateDetails;
  onDetailsChange: (details: EstimateDetails) => void;
}

export function EstimateDetailsPage({ estimateDetails, onDetailsChange }: EstimateDetailsPageProps) {
  const addEstimate = () => {
    onDetailsChange({
      ...estimateDetails,
      estimates: [
        ...estimateDetails.estimates,
        { services: [], total: "" }
      ]
    });
  };

  const addService = (estimateIndex: number) => {
    const newEstimates = [...estimateDetails.estimates];
    newEstimates[estimateIndex].services.push({
      description: "",
      amount: ""
    });
    onDetailsChange({
      ...estimateDetails,
      estimates: newEstimates
    });
  };

  const removeService = (estimateIndex: number, serviceIndex: number) => {
    const newEstimates = [...estimateDetails.estimates];
    newEstimates[estimateIndex].services.splice(serviceIndex, 1);
    onDetailsChange({
      ...estimateDetails,
      estimates: newEstimates
    });
  };

  const updateService = (
    estimateIndex: number,
    serviceIndex: number,
    field: keyof Service,
    value: string
  ) => {
    const newEstimates = [...estimateDetails.estimates];
    newEstimates[estimateIndex].services[serviceIndex][field] = value;
    onDetailsChange({
      ...estimateDetails,
      estimates: newEstimates
    });
  };

  const updateEstimateTotal = (estimateIndex: number, total: string) => {
    const newEstimates = [...estimateDetails.estimates];
    newEstimates[estimateIndex].total = total;
    onDetailsChange({
      ...estimateDetails,
      estimates: newEstimates
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-light">ESTIMATES</h2>
        <p className="text-sm text-muted-foreground">as per your requirement</p>
        
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Events Coverage</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Candid Photography & Cinematography (All events)
                </p>
              </div>
            </div>

            {estimateDetails.estimates.map((estimate, estimateIndex) => (
              <div key={estimateIndex} className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium">ESTIMATE {estimateIndex + 1}</h3>
                
                <div className="space-y-4">
                  {estimate.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <Label>Service Description</Label>
                        <Textarea
                          value={service.description}
                          onChange={(e) => 
                            updateService(estimateIndex, serviceIndex, "description", e.target.value)
                          }
                          className="mt-2"
                          placeholder="Enter service description"
                        />
                      </div>
                      <div className="w-32">
                        <Label>Amount</Label>
                        <Input
                          value={service.amount}
                          onChange={(e) =>
                            updateService(estimateIndex, serviceIndex, "amount", e.target.value)
                          }
                          className="mt-2"
                          placeholder="₹0.00"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mt-8"
                        onClick={() => removeService(estimateIndex, serviceIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addService(estimateIndex)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>

                  <div className="flex justify-end gap-2 items-center">
                    <Label>Total Amount:</Label>
                    <Input
                      value={estimate.total}
                      onChange={(e) => updateEstimateTotal(estimateIndex, e.target.value)}
                      className="w-32"
                      placeholder="₹0.00"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addEstimate}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Estimate Option
            </Button>

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
