
import { Button } from "@/components/ui/button";
import { Camera, Globe, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function GetStartedSection() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <section className="py-12 md:py-20 px-4 bg-cream">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-8 font-playfair text-velvet-dark">
          Ready to Get Started?
        </h2>
        <p className="text-lg md:text-xl mb-8 md:mb-12 text-velvet-muted">
          Join thousands of photographers and videographers who have transformed their business with StudioSync.
        </p>
        
        <div className="grid grid-cols-1 gap-4 md:gap-6 max-w-sm md:max-w-3xl mx-auto">
          <Button 
            onClick={() => navigate('/photographers')}
            size={isMobile ? "default" : "lg"}
            className={`h-12 md:h-16 text-base md:text-lg text-warmWhite flex items-center justify-center w-full font-playfair shadow-lg hover:shadow-xl transition-shadow`}
            style={{ backgroundColor: 'hsl(var(--dusty-blue))' }}
          >
            <Camera className="h-5 w-5 md:h-6 md:w-6 mr-2" />
            Start as a Photographer
          </Button>

          <Button 
            onClick={() => navigate('/portfolio')}
            variant="outline"
            size={isMobile ? "default" : "lg"}
            className={`h-12 md:h-16 text-base md:text-lg border-2 w-full font-playfair shadow-lg hover:shadow-xl transition-shadow bg-dustyBlue-whisper/50 backdrop-blur-sm`}
            style={{ 
              borderColor: 'hsl(var(--dusty-blue))', 
              color: 'hsl(var(--dusty-blue-dark))'
            }}
          >
            <User className="h-5 w-5 md:h-6 md:w-6 mr-2" />
            Create Your Portfolio
          </Button>
          
          <Button 
            onClick={() => navigate('/client-portal')}
            variant="outline"
            size={isMobile ? "default" : "lg"}
            className={`h-12 md:h-16 text-base md:text-lg border-2 w-full font-playfair shadow-lg hover:shadow-xl transition-shadow bg-dustyBlue-whisper/50 backdrop-blur-sm`}
            style={{ 
              borderColor: 'hsl(var(--dusty-blue))', 
              color: 'hsl(var(--dusty-blue-dark))'
            }}
          >
            <Globe className="h-5 w-5 md:h-6 md:w-6 mr-2" />
            Access Client Portal
          </Button>
        </div>
      </div>
    </section>
  );
}
