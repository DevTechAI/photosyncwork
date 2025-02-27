
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
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
          <p className="text-muted-foreground mt-2">Complete Studio Management</p>
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
          
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
        
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
