
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
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md p-8 bg-white border-gray-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">StudioSync</h1>
          <p className="text-gray-600 mt-2">Studio Success System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-gray-300 text-gray-900"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password (any password works)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border-gray-300 text-gray-900"
              required
            />
            <p className="text-xs text-gray-500">
              For demo purposes, any password will work. Only email is validated.
            </p>
          </div>
          
          <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 text-white">
            Sign In
          </Button>
        </form>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium mb-2 text-gray-900">Demo Accounts:</h3>
          <div className="space-y-1 text-sm text-gray-600">
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
