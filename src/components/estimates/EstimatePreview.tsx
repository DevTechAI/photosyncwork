
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send, Share2, X, Check, ThumbsUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onStatusChange?: (estimateId: string, newStatus: string, negotiatedAmount?: string) => void;
}

export function EstimatePreview({ open, onClose, estimate, onStatusChange }: EstimatePreviewProps) {
  const { toast } = useToast();
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [negotiatedAmount, setNegotiatedAmount] = useState(estimate?.amount || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let intervalId: ReturnType<typeof setTimeout>;
    
    if (showEmailForm && estimate?.status === 'pending') {
      intervalId = setInterval(() => {
        // Check localStorage for estimate status updates
        const savedEstimates = localStorage.getItem("estimates");
        if (savedEstimates) {
          const estimates = JSON.parse(savedEstimates);
          const updatedEstimate = estimates.find((est: any) => est.id === estimate.id);
          
          if (updatedEstimate && updatedEstimate.status === 'approved' && onStatusChange) {
            onStatusChange(estimate.id, 'approved');
            toast({
              title: "Estimate Approved!",
              description: "The client has approved the estimate.",
            });
            clearInterval(intervalId);
          }
        }
      }, 5000); // Check every 5 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showEmailForm, estimate?.id, estimate?.status, onStatusChange, toast]);

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

    try {
      const { data, error } = await supabase.functions.invoke("send-estimate-email", {
        body: {
          to: emailInput,
          clientName: estimate.clientName,
          estimateId: estimate.id,
          amount: estimate.amount,
          services: estimate.services,
          deliverables: estimate.deliverables
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log("Email function response:", data);
      
      toast({
        title: "Estimate Sent!",
        description: `Estimate has been sent to ${emailInput}`,
      });
      
      setEmailInput("");
      setShowEmailForm(false);
    } catch (error) {
      console.error("Failed to send email:", error);
      toast({
        title: "Error",
        description: `Failed to send email: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

    const formattedPhone = phoneInput.replace(/\D/g, "");
    
    const message = encodeURIComponent(
      `*Estimate for ${estimate.clientName}*\n\nAmount: ${estimate.amount}\nDate: ${new Date(estimate.date).toLocaleDateString()}\n\nThank you for considering our services!`
    );
    
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
    
    toast({
      title: "WhatsApp Opened",
      description: "You can now send the estimate message",
    });
    
    setPhoneInput("");
    setShowWhatsAppForm(false);
  };

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(estimate.id, newStatus, negotiatedAmount);
      setShowApprovalForm(false);
      
      toast({
        title: "Estimate Updated",
        description: `Estimate status changed to ${newStatus}`,
      });
    }
  };

  const handleApproval = () => {
    handleStatusChange("approved");
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
                      setShowApprovalForm(false);
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
                      setShowApprovalForm(false);
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
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setShowApprovalForm(true);
                      setShowEmailForm(false);
                      setShowWhatsAppForm(false);
                    }}
                    className={estimate.status === "approved" ? "bg-green-100 text-green-700" : ""}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Client Approval</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DialogHeader>

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

        {showApprovalForm && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Update Estimate Status</Label>
                  <Select
                    onValueChange={(value) => handleStatusChange(value)}
                    defaultValue={estimate.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="negotiating">Negotiating</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="negotiatedAmount">Negotiated Amount</Label>
                  <div className="flex items-end gap-2">
                    <Input
                      id="negotiatedAmount"
                      placeholder="₹0.00"
                      value={negotiatedAmount}
                      onChange={(e) => setNegotiatedAmount(e.target.value)}
                    />
                    <Button onClick={handleApproval} variant="default" className="bg-green-600 hover:bg-green-700">
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowApprovalForm(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="border rounded-lg p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold">ESTIMATE</h1>
            <p className="text-muted-foreground">StudioSync Photography Services</p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              estimate.status === "approved" ? "bg-green-100 text-green-800" :
              estimate.status === "declined" ? "bg-red-100 text-red-800" :
              estimate.status === "negotiating" ? "bg-yellow-100 text-yellow-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              Status: {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
            </div>
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
                Valid until: {new Date(new Date(estimate.date).getTime() + 30*24*60*60*1000).toLocaleDateString()}
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
