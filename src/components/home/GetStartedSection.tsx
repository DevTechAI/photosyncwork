
import { Button } from "@/components/ui/button";
import { Camera, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function GetStartedSection() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <section className="py-12 md:py-20 px-4" style={{ backgroundColor: '#f7f5f2' }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-8" style={{ color: '#1a2238' }}>
          Ready to Get Started?
        </h2>
        <p className="text-lg md:text-xl mb-8 md:mb-12" style={{ color: '#999999' }}>
          Join thousands of photographers and videographers who have transformed their business with StudioSync.
        </p>
        
        <div className="grid grid-cols-1 gap-4 md:gap-8 max-w-sm md:max-w-2xl mx-auto">
          <Button 
            onClick={() => navigate('/photographers')}
            size={isMobile ? "default" : "lg"}
            className={`h-12 md:h-16 text-base md:text-lg text-white flex items-center justify-center w-full`}
            style={{ backgroundColor: '#1a2238' }}
          >
            <Camera className="h-5 w-5 md:h-6 md:w-6 mr-2" />
            Start as a Photographer
          </Button>
          
          <Button 
            onClick={() => navigate('/client-portal')}
            variant="outline"
            size={isMobile ? "default" : "lg"}
            className={`h-12 md:h-16 text-base md:text-lg border-2 w-full`}
            style={{ 
              borderColor: '#b99364', 
              color: '#b99364'
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
