
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // For demo purposes, we only validate the email against our sample users
    // In a real application, you would also validate the password
    const success = login(email);
    
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome to StudioSync",
      });
      navigate("/");
    } else {
      toast({
        title: "Login failed",
        description: "Email not found. Please try one of the demo accounts.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold">StudioSync</h1>
          <p className="text-muted-foreground mt-2">Studio Success System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password (any password works)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              For demo purposes, any password will work. Only email is validated.
            </p>
          </div>
          
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t">
          <Button 
            onClick={() => navigate('/portfolio')} 
            variant="outline"
            className="w-full mb-4"
          >
            <User className="h-4 w-4 mr-2" />
            Create Portfolio (No Login Required)
          </Button>
          
          <Button 
            onClick={() => navigate('/hire')} 
            variant="outline"
            className="w-full"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Browse Available Talent
          </Button>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm font-medium mb-2">Demo Accounts:</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Manager: admin@example.com</p>
            <p>Accounts: finance@example.com</p>
            <p>CRM: crm@example.com</p>
            <p>Photographer: ankit@example.com</p>
            <p>Videographer: priya@example.com</p>
            <p>Editor: vikram@example.com</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
