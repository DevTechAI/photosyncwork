
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { serviceTemplates } from "../data/serviceTemplates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceItemsCardProps {
  items: { description: string; amount: string }[];
  onItemsChange: (items: { description: string; amount: string }[]) => void;
}

export function InvoiceItemsCard({ items, onItemsChange }: InvoiceItemsCardProps) {
  const addItem = () => {
    onItemsChange([...items, { description: "", amount: "" }]);
  };

  const removeItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const handleTemplateSelect = (index: number, template: typeof serviceTemplates[0]) => {
    const newItems = [...items];
    newItems[index] = {
      description: template.label,
      amount: template.price,
    };
    onItemsChange(newItems);
  };

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Invoice Items</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <Label htmlFor={`description-${index}`}>Description</Label>
                <Select
                  onValueChange={(value) => {
                    const template = serviceTemplates.find(t => t.label === value);
                    if (template) {
                      handleTemplateSelect(index, template);
                    }
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select service or type custom" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTemplates.map((template) => (
                      <SelectItem key={template.label} value={template.label}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id={`description-${index}`}
                  placeholder="Or type custom service description"
                  className="mt-2"
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].description = e.target.value;
                    onItemsChange(newItems);
                  }}
                />
              </div>
              <div className="w-32">
                <Label htmlFor={`amount-${index}`}>Amount</Label>
                <Input
                  id={`amount-${index}`}
                  placeholder="₹0.00"
                  className="mt-2"
                  value={item.amount}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].amount = e.target.value;
                    onItemsChange(newItems);
                  }}
                />
              </div>
              {items.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-8"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        className="mt-4 w-full"
        onClick={addItem}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </Card>
  );
}
