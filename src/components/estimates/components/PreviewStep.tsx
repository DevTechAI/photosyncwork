
import { Button } from "@/components/ui/button";
import { Mail, Share2 } from "lucide-react";
import { EstimateDetails } from "../preview/EstimateDetails";
import { EmailForm } from "../preview/EmailForm";
import { WhatsAppForm } from "../preview/WhatsAppForm";
import { useState } from "react";

interface PreviewStepProps {
  estimate: any;
}

export function PreviewStep({ estimate }: PreviewStepProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);

  return (
    <div className="space-y-6">
      {showEmailForm && (
        <EmailForm 
          onClose={() => setShowEmailForm(false)} 
          estimate={estimate} 
        />
      )}
      
      {showWhatsAppForm && (
        <WhatsAppForm 
          onClose={() => setShowWhatsAppForm(false)} 
          estimate={estimate}
        />
      )}
      
      {!showEmailForm && !showWhatsAppForm && (
        <div className="flex justify-center space-x-4 mb-4">
          <Button onClick={() => setShowEmailForm(true)} variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Send via Email
          </Button>
          <Button onClick={() => setShowWhatsAppForm(true)} variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share via WhatsApp
          </Button>
        </div>
      )}
      
      <EstimateDetails estimate={estimate} />
    </div>
  );
}
