
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center bg-white border-gray-300">
        <CardHeader>
          <div className="mx-auto mb-4 p-3 bg-gray-100 rounded-full w-fit">
            <Camera className="h-8 w-8 text-gray-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">StudioSync Photographers</CardTitle>
          <CardDescription className="text-gray-600">
            Professional photography & videography management platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Sign in to access your studio dashboard, manage projects, clients, and team collaboration.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/login')} 
              variant="outline"
              className="w-full bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
              size="lg"
            >
              Sign In to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="w-full bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
            >
              Back to Home
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Redirecting to sign in page in 3 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
