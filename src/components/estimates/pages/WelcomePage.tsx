
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface WelcomePageProps {
  clientName: string;
  clientEmail: string;
  onClientNameChange: (name: string) => void;
  onClientEmailChange: (email: string) => void;
  isReadOnly?: boolean;
}

export function WelcomePage({ 
  clientName, 
  clientEmail,
  onClientNameChange, 
  onClientEmailChange,
  isReadOnly = false 
}: WelcomePageProps) {
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    if (!email) return true; // Allow empty email for now
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    onClientEmailChange(email);
    
    if (email && !validateEmail(email)) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-light tracking-tight">STUDIOSYNC</h1>
        <p className="text-2xl font-light text-muted-foreground">
          {clientName ? `Hello ${clientName}!` : "Welcome"}
        </p>
      </div>
      
      <div className="max-w-md mx-auto space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => onClientNameChange(e.target.value)}
            placeholder="Enter client name"
            readOnly={isReadOnly}
            className={isReadOnly ? "bg-gray-100" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientEmail">Client Email</Label>
          <Input
            id="clientEmail"
            type="email"
            value={clientEmail}
            onChange={handleEmailChange}
            placeholder="Enter client email"
            readOnly={isReadOnly}
            className={isReadOnly ? "bg-gray-100" : ""}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto text-center text-muted-foreground">
        <p className="text-sm leading-relaxed">
          We are a Hyderabad based Wedding Photography firm with over 11 years of experience in non-meddling,
          inventive, photojournalistic approach. We need you to recollect how you felt on your big day. At each
          wedding, We plan to archive genuine minutes and crude feelings in new and remarkable manners.
        </p>
      </div>
    </div>
  );
}
