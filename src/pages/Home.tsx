import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { GetStartedSection } from "@/components/home/GetStartedSection";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Camera, Briefcase, Users, ShieldCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const { user, loading, toggleBypassAuth } = useAuth();
  const navigate = useNavigate();
  const [showBypassOptions, setShowBypassOptions] = useState(false);
  const [bypassRole, setBypassRole] = useState("manager");

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      console.log('User authenticated, redirecting to dashboard:', user.email);
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show redirecting message
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Toggle bypass options with a secret key combination (triple-click on the logo)
  const handleLogoClick = () => {
    setShowBypassOptions(!showBypassOptions);
  };
  
  const handleBypassAuth = () => {
    toggleBypassAuth(bypassRole);
    navigate('/dashboard');
  };

  // Show the home page for non-authenticated users
  return (
    <div className="min-h-screen bg-warmWhite">
      {/* Quick access navigation for non-authenticated users */}
      <div className="bg-dustyBlue-whisper border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/portfolio')}
                className="flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                Portfolio
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/hire')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Browse Talent
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/photographers')}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                For Photographers
              </Button>
            </div>
            
            {/* Bypass Auth Section (Hidden by default) */}
            {showBypassOptions && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-300 rounded-md">
                <ShieldCheck className="h-4 w-4 text-yellow-600" />
                <Select value={bypassRole} onValueChange={setBypassRole}>
                  <SelectTrigger className="h-8 w-40 text-xs">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="accounts">Accounts</SelectItem>
                    <SelectItem value="crm">CRM</SelectItem>
                    <SelectItem value="photographer">Photographer</SelectItem>
                    <SelectItem value="videographer">Videographer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleBypassAuth} 
                  variant="outline" 
                  size="sm"
                  className="h-8 bg-yellow-100 border-yellow-300 text-yellow-800"
                >
                  Bypass
                </Button>
              </div>
            )}
            
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-dustyBlue hover:bg-dustyBlue-dark text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      <div 
        className="cursor-pointer"
        onClick={handleLogoClick}
      >
        <HeroSection />
      </div>
      <AboutSection />
      <WhyChooseUsSection />
      <GetStartedSection />
      <Footer />
    </div>
  );
}