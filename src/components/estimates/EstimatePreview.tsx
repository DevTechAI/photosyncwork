
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send, Share2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EstimatePreviewProps {
  open: boolean;
  onClose: () => void;
  estimate: {
    id: string;
    clientName: string;
    date: string;
    amount: string;
    status: string;
    services?: Array<{
      event: string;
      date: string;
      photographers: string;
      cinematographers: string;
    }>;
    deliverables?: string[];
  };
}

export function EstimatePreview({ open, onClose, estimate }: EstimatePreviewProps) {
  const { toast } = useToast();
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!emailInput) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    toast({
      title: "Estimate Sent!",
      description: `Estimate has been sent to ${emailInput}`,
    });
    
    setEmailInput("");
    setShowEmailForm(false);
  };

  const handleSendWhatsApp = () => {
    if (!phoneInput) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    // Format phone number (remove spaces, dashes, etc.)
    const formattedPhone = phoneInput.replace(/\D/g, "");
    
    // Create WhatsApp message with estimate details
    const message = encodeURIComponent(
      `*Estimate for ${estimate.clientName}*\n\nAmount: ${estimate.amount}\nDate: ${new Date(estimate.date).toLocaleDateString()}\n\nThank you for considering our services!`
    );
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
    
    toast({
      title: "WhatsApp Opened",
      description: "You can now send the estimate message",
    });
    
    setPhoneInput("");
    setShowWhatsAppForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Estimate Preview</DialogTitle>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setShowEmailForm(true);
                      setShowWhatsAppForm(false);
                    }}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send via Email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setShowWhatsAppForm(true);
                      setShowEmailForm(false);
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share via WhatsApp</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DialogHeader>

        {/* Email form */}
        {showEmailForm && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="email">Client Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="client@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSendEmail}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEmailForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* WhatsApp form */}
        {showWhatsAppForm && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="phone">Client Phone Number (with country code)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                  />
                </div>
                <Button onClick={handleSendWhatsApp}>
                  Share
                  <Share2 className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowWhatsAppForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estimate Preview */}
        <div className="border rounded-lg p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold">ESTIMATE</h1>
            <p className="text-muted-foreground">StudioSync Photography Services</p>
          </div>

          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h2 className="font-medium">Client</h2>
              <p>{estimate.clientName}</p>
              <p className="text-sm text-muted-foreground">
                Date: {new Date(estimate.date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <h2 className="font-medium">Estimate #{estimate.id}</h2>
              <p className="text-sm text-muted-foreground capitalize">
                Status: {estimate.status}
              </p>
            </div>
          </div>

          {estimate.services && estimate.services.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Services</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Event</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Photographers</th>
                    <th className="text-left py-2">Cinematographers</th>
                  </tr>
                </thead>
                <tbody>
                  {estimate.services.map((service, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{service.event}</td>
                      <td className="py-2">{new Date(service.date).toLocaleDateString()}</td>
                      <td className="py-2">{service.photographers}</td>
                      <td className="py-2">{service.cinematographers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {estimate.deliverables && estimate.deliverables.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Deliverables</h3>
              <ul className="list-disc ml-5 space-y-1">
                {estimate.deliverables.map((deliverable, index) => (
                  <li key={index}>{deliverable}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t pt-4 text-right">
            <span className="font-medium">Total Amount: </span>
            <span className="text-xl font-semibold">{estimate.amount}</span>
          </div>

          <div className="border-t pt-4 text-sm text-muted-foreground">
            <p>Terms & Conditions</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>This estimate is valid for 30 days from the date of issue.</li>
              <li>A 50% advance payment is required to confirm the booking.</li>
              <li>The balance payment is due before the event date.</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
