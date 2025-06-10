
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ArrowRight, User } from "lucide-react";

export default function PhotographersPortal() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to login after 3 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">StudioSync Photographers</CardTitle>
          <CardDescription>
            Professional photography & videography management platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Sign in to access your studio dashboard, manage projects, clients, and team collaboration.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/login')} 
              variant="outline"
              className="w-full border-2 bg-dustyBlue-whisper/70 backdrop-blur-md hover:bg-dustyBlue-soft hover:shadow-xl transition-all duration-300"
              size="lg"
              style={{ 
                borderColor: 'hsl(var(--dusty-blue))', 
                color: 'hsl(var(--dusty-blue-dark))'
              }}
            >
              Sign In to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <Button 
              onClick={() => navigate('/portfolio')} 
              variant="outline"
              className="w-full border-2 bg-dustyBlue-whisper/70 backdrop-blur-md hover:bg-dustyBlue-soft hover:shadow-xl transition-all duration-300"
              style={{ 
                borderColor: 'hsl(var(--dusty-blue))', 
                color: 'hsl(var(--dusty-blue-dark))'
              }}
            >
              <User className="h-4 w-4 mr-2" />
              Create Portfolio
            </Button>
            
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="w-full border-2 bg-dustyBlue-whisper/70 backdrop-blur-md hover:bg-dustyBlue-soft hover:shadow-xl transition-all duration-300"
              style={{ 
                borderColor: 'hsl(var(--dusty-blue))', 
                color: 'hsl(var(--dusty-blue-dark))'
              }}
            >
              Back to Home
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Redirecting to sign in page in 3 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
