
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/contexts/SettingsContext";
import { useEffect, useState } from "react";

interface ClientDetailsCardProps {
  invoiceType: "proforma" | "paid";
  onInvoiceTypeChange: (type: "proforma" | "paid") => void;
}

export function ClientDetailsCard({ invoiceType, onInvoiceTypeChange }: ClientDetailsCardProps) {
  const { company } = useSettings();
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyGst, setCompanyGst] = useState("");
  
  // Load company details when available
  useEffect(() => {
    if (company) {
      setCompanyName(company.name || "");
      setCompanyEmail(company.email || "");
      setCompanyPhone(company.phone || "");
      setCompanyAddress(
        [company.address, company.city, company.state, company.pincode]
          .filter(Boolean)
          .join(", ")
      );
      setCompanyGst(company.gst_number || "");
    }
  }, [company]);

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Client & Company Details</h3>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="invoiceType">Invoice Type</Label>
            <Select value={invoiceType} onValueChange={onInvoiceTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select invoice type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proforma">Proforma Invoice</SelectItem>
                <SelectItem value="paid">Paid Invoice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Invoice Date</Label>
            <Input id="date" type="date" />
          </div>
        </div>

        {/* Client Details Section */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-4">Client Details</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input id="client" placeholder="Enter client name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="client@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Address</Label>
              <Input id="clientAddress" placeholder="Enter client's address" />
            </div>
            {invoiceType === "paid" && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientGst">Client GST Number</Label>
                <Input 
                  id="clientGst" 
                  placeholder="Enter client's GST number"
                  className="uppercase"
                />
              </div>
            )}
          </div>
        </div>

        {/* Company Details Section */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-4">Company Details</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName" 
                placeholder="Enter company name" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input 
                id="companyEmail" 
                type="email" 
                placeholder="company@example.com" 
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Company Phone</Label>
              <Input 
                id="companyPhone" 
                type="tel" 
                placeholder="+91 98765 43210" 
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Input 
                id="companyAddress" 
                placeholder="Enter company address"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
            </div>
            {invoiceType === "paid" && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyGst">Company GST Number</Label>
                <Input 
                  id="companyGst" 
                  placeholder="Enter company's GST number"
                  className="uppercase"
                  value={companyGst}
                  onChange={(e) => setCompanyGst(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
