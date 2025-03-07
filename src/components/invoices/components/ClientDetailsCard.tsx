
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
import { Switch } from "@/components/ui/switch";

interface ClientDetailsCardProps {
  invoiceType: "proforma" | "paid";
  onInvoiceTypeChange: (type: "proforma" | "paid") => void;
  paymentReceived?: boolean;
  onPaymentReceivedChange?: (received: boolean) => void;
  paymentDate?: string;
  onPaymentDateChange?: (date: string) => void;
  paymentMethod?: string;
  onPaymentMethodChange?: (method: string) => void;
}

export function ClientDetailsCard({ 
  invoiceType, 
  onInvoiceTypeChange,
  paymentReceived = false,
  onPaymentReceivedChange = () => {},
  paymentDate = "",
  onPaymentDateChange = () => {},
  paymentMethod = "bank",
  onPaymentMethodChange = () => {}
}: ClientDetailsCardProps) {
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

        {/* Payment Details Section - for paid invoices */}
        {invoiceType === "paid" && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-4">Payment Details</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 flex items-center justify-between">
                <Label htmlFor="paymentReceived">Payment Received</Label>
                <Switch 
                  id="paymentReceived" 
                  checked={paymentReceived}
                  onCheckedChange={onPaymentReceivedChange}
                />
              </div>
              {paymentReceived && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Payment Date</Label>
                    <Input 
                      id="paymentDate" 
                      type="date" 
                      value={paymentDate}
                      onChange={(e) => onPaymentDateChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

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
              <Input id="companyName" placeholder="Enter company name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input id="companyEmail" type="email" placeholder="company@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Company Phone</Label>
              <Input id="companyPhone" type="tel" placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Input id="companyAddress" placeholder="Enter company address" />
            </div>
            {invoiceType === "paid" && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyGst">Company GST Number</Label>
                <Input 
                  id="companyGst" 
                  placeholder="Enter company's GST number"
                  className="uppercase"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
