
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ClientDetailsCard() {
  return (
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
  );
}
