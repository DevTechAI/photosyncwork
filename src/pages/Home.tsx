
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { GetStartedSection } from "@/components/home/GetStartedSection";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Show loading while checking auth state
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

  return (
    <div className="min-h-screen bg-warmWhite">
      <HeroSection />
      <AboutSection />
      <WhyChooseUsSection />
      <GetStartedSection />
      <Footer />
    </div>
  );
}
