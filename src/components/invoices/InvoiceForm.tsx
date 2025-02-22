import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Percent, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const serviceTemplates = [
  { label: "Wedding Photography - Full Day", price: "45000" },
  { label: "Pre-wedding Photoshoot", price: "25000" },
  { label: "Birthday Party Coverage", price: "15000" },
  { label: "Corporate Event Photography", price: "35000" },
  { label: "Album Design & Printing", price: "10000" },
  { label: "Portrait Photography Session", price: "5000" },
];

interface InvoiceFormProps {
  open: boolean;
  onClose: () => void;
}

export function InvoiceForm({ open, onClose }: InvoiceFormProps) {
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const [gstRate, setGstRate] = useState("18");

  const addItem = () => {
    setItems([...items, { description: "", amount: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleTemplateSelect = (index: number, template: typeof serviceTemplates[0]) => {
    const newItems = [...items];
    newItems[index] = {
      description: template.label,
      amount: template.price,
    };
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const calculateGST = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * Number(gstRate)) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for your photography services.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Client Details</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input id="client" placeholder="Enter client name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Invoice Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="client@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter client's address" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="clientGst">Client GST Number</Label>
                  <Input 
                    id="clientGst" 
                    placeholder="Enter client's GST number"
                    className="uppercase"
                  />
                </div>
              </div>
            </div>
          </Card>

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
                          setItems(newItems);
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
                          setItems(newItems);
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

          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="gst">GST Rate</Label>
                  <div className="relative mt-2">
                    <Input
                      id="gst"
                      type="number"
                      value={gstRate}
                      onChange={(e) => setGstRate(e.target.value)}
                      className="pr-10"
                    />
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST ({gstRate}%):</span>
                  <span>₹{calculateGST().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Invoice</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
