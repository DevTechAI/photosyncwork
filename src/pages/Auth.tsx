
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to StudioSync</CardTitle>
          <CardDescription>
            Professional photography & videography management platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Sign in with your Google account to access your studio dashboard, manage projects, and collaborate with your team.
          </p>
          
          <Button 
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? "Signing in..." : "Continue with Google"}
          </Button>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>✓ 5GB free storage included</p>
            <p>✓ Portfolio creation tools</p>
            <p>✓ CRM and project management</p>
            <p>✓ Team collaboration features</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
