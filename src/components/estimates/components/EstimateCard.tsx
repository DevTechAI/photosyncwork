
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Estimate, Service } from "../types";
import { ServiceCard } from "./ServiceCard";
import { Deliverables } from "./Deliverables";

interface EstimateCardProps {
  estimate: Estimate;
  index: number;
  onServiceAdd: () => void;
  onServiceUpdate: (serviceIndex: number, field: keyof Service, value: string) => void;
  onServiceRemove: (serviceIndex: number) => void;
  onDeliverableAdd: () => void;
  onDeliverableUpdate: (deliverableIndex: number, value: string) => void;
  onDeliverableRemove: (deliverableIndex: number) => void;
  onTotalUpdate: (total: string) => void;
}

export function EstimateCard({
  estimate,
  index,
  onServiceAdd,
  onServiceUpdate,
  onServiceRemove,
  onDeliverableAdd,
  onDeliverableUpdate,
  onDeliverableRemove,
  onTotalUpdate,
}: EstimateCardProps) {
  return (
    <div className="space-y-4 pt-6 border-t">
      <h3 className="text-lg font-medium">PACKAGE OPTION {index + 1}</h3>
      
      <div className="space-y-6">
        {estimate.services.map((service, serviceIndex) => (
          <ServiceCard
            key={serviceIndex}
            service={service}
            onUpdate={(field, value) => onServiceUpdate(serviceIndex, field, value)}
            onRemove={() => onServiceRemove(serviceIndex)}
          />
        ))}
      </div>

      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={onServiceAdd}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>

        <Deliverables
          deliverables={estimate.deliverables}
          onAdd={onDeliverableAdd}
          onUpdate={onDeliverableUpdate}
          onRemove={onDeliverableRemove}
        />

        <div className="flex justify-end gap-2 items-center pt-4 border-t">
          <Label>Total Amount:</Label>
          <Input
            value={estimate.total}
            onChange={(e) => onTotalUpdate(e.target.value)}
            className="w-32"
            placeholder="₹0.00"
          />
        </div>
      </div>
    </div>
  );
}
