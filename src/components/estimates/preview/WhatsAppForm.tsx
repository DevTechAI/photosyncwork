
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Share2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WhatsAppFormProps {
  onClose: () => void;
  estimate: {
    clientName: string;
    amount: string;
    date: string;
    packages?: Array<{
      name?: string;
      amount: string;
      services: Array<{
        event: string;
        date: string;
        photographers: string;
        cinematographers: string;
      }>;
      deliverables: string[];
    }>;
  };
}

export function WhatsAppForm({ onClose, estimate }: WhatsAppFormProps) {
  const [phoneInput, setPhoneInput] = useState("");
  const { toast } = useToast();

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
    
    // Generate package information
    let packageText = "";
    
    if (estimate.packages && estimate.packages.length > 0) {
      estimate.packages.forEach((pkg, idx) => {
        packageText += `\n\n*Package Option ${idx + 1}${pkg.name ? `: ${pkg.name}` : ''}*`;
        packageText += `\nAmount: ${pkg.amount}`;
        
        if (pkg.services && pkg.services.length > 0) {
          packageText += "\n\nEvents:";
          pkg.services.forEach(service => {
            packageText += `\n- ${service.event} (${new Date(service.date).toLocaleDateString()})`;
          });
        }
      });
    } else {
      packageText = `\n\nAmount: ${estimate.amount}`;
    }
    
    const message = encodeURIComponent(
      `*Estimate for ${estimate.clientName}*\n\nDate: ${new Date(estimate.date).toLocaleDateString()}${packageText}\n\nThank you for considering our services!`
    );
    
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
    
    toast({
      title: "WhatsApp Opened",
      description: "You can now send the estimate message",
    });
    
    setPhoneInput("");
    onClose();
  };

  return (
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
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
