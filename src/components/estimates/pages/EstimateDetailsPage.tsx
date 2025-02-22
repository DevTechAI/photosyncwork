
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Service {
  event: string;
  date: string;
  photographers: string;
  cinematographers: string;
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

const EVENT_OPTIONS = [
  'Engagement',
  'Haldi',
  'Mehendi',
  'Sangeeth',
  'Lagnapatrika',
  'Wedding',
  'Pellikthuru',
  'Pellikoduku',
  'Reception'
];

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
      event: "",
      date: "",
      photographers: "",
      cinematographers: "",
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
                
                <div className="space-y-6">
                  {estimate.services.map((service, serviceIndex) => (
                    <Card key={serviceIndex} className="p-4 relative">
                      <div className="absolute right-2 top-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeService(estimateIndex, serviceIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Event</Label>
                          <Select
                            value={service.event}
                            onValueChange={(value) => 
                              updateService(estimateIndex, serviceIndex, "event", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select event" />
                            </SelectTrigger>
                            <SelectContent>
                              {EVENT_OPTIONS.map((event) => (
                                <SelectItem key={event} value={event}>
                                  {event}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={service.date}
                            onChange={(e) =>
                              updateService(estimateIndex, serviceIndex, "date", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Number of Photographers</Label>
                          <Input
                            type="number"
                            min="0"
                            value={service.photographers}
                            onChange={(e) =>
                              updateService(estimateIndex, serviceIndex, "photographers", e.target.value)
                            }
                            placeholder="Enter number of photographers"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Number of Cinematographers</Label>
                          <Input
                            type="number"
                            min="0"
                            value={service.cinematographers}
                            onChange={(e) =>
                              updateService(estimateIndex, serviceIndex, "cinematographers", e.target.value)
                            }
                            placeholder="Enter number of cinematographers"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label>Amount</Label>
                        <Input
                          className="w-48 mt-2"
                          value={service.amount}
                          onChange={(e) =>
                            updateService(estimateIndex, serviceIndex, "amount", e.target.value)
                          }
                          placeholder="₹0.00"
                        />
                      </div>
                    </Card>
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
                    Add Event
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
