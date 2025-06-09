
import { Button } from "@/components/ui/button";
import { Globe, Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeroSection() {
  const navigate = useNavigate();
  const [logoHovered, setLogoHovered] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Logo */}
      <div 
        className="mb-12 cursor-pointer transition-all duration-300 hover:scale-105"
        onMouseEnter={() => setLogoHovered(true)}
        onMouseLeave={() => setLogoHovered(false)}
      >
        <img 
          src="/lovable-uploads/b5a2c474-15f8-4a49-b102-73278d7c52f1.png" 
          alt="StudioSync Logo" 
          className="h-24 md:h-32 w-auto object-contain mx-auto"
        />
      </div>

      {/* Three Main Buttons - Bottom of Screen */}
      <div className="absolute bottom-16 left-0 right-0 px-4 md:px-8 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-8 max-w-xs md:max-w-7xl mx-auto">
          {/* Left Button - Client Portal */}
          <Button 
            onClick={() => navigate('/client-portal')}
            variant="outline" 
            className={`h-9 md:h-10 w-full md:w-auto px-4 md:px-6 py-2 border-2 text-xs md:text-sm hover:bg-transparent transition-all duration-700 ease-in-out overflow-hidden ${
              logoHovered ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}
            style={{ 
              borderColor: '#b99364', 
              color: '#b99364',
              backgroundColor: 'transparent'
            }}
          >
            <Globe className="h-3 w-3 md:h-4 md:w-4 mr-2" />
            <span className="font-medium">Client Portal</span>
          </Button>

          {/* Center Button - Photographers Portal */}
          <Button 
            onClick={() => navigate('/photographers')}
            variant="outline" 
            className={`h-9 md:h-10 w-full md:w-auto px-4 md:px-6 py-2 border-2 text-xs md:text-sm hover:bg-transparent transition-all duration-700 ease-in-out overflow-hidden ${
              logoHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
            style={{ 
              borderColor: '#b99364', 
              color: '#b99364',
              backgroundColor: 'transparent'
            }}
          >
            <Users className="h-3 w-3 md:h-4 md:w-4 mr-2" />
            <span className="font-medium">Photographers Portal</span>
          </Button>

          {/* Right Button - Hire a Teammate */}
          <Button 
            onClick={() => navigate('/hire')}
            variant="outline" 
            className={`h-9 md:h-10 w-full md:w-auto px-4 md:px-6 py-2 border-2 text-xs md:text-sm hover:bg-transparent transition-all duration-700 ease-in-out overflow-hidden ${
              logoHovered ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
            style={{ 
              borderColor: '#b99364', 
              color: '#b99364',
              backgroundColor: 'transparent'
            }}
          >
            <UserPlus className="h-3 w-3 md:h-4 md:w-4 mr-2" />
            <span className="font-medium">Hire a Teammate</span>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator - Absolutely positioned at bottom center */}
      <div 
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
          logoHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 rounded-full flex justify-center" style={{ borderColor: '#b99364' }}>
          <div className="w-1 h-2 md:h-3 rounded-full mt-2 animate-pulse" style={{ backgroundColor: '#b99364' }}></div>
        </div>
      </div>
    </section>
  );
}
