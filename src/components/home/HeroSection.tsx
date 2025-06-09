
import { Button } from "@/components/ui/button";
import { Globe, Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function HeroSection() {
  const navigate = useNavigate();
  const [logoHovered, setLogoHovered] = useState(false);
  
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
          className="h-32 w-auto object-contain mx-auto"
        />
      </div>

      {/* Three Main Buttons - Bottom of Screen */}
      <div className="absolute bottom-16 left-0 right-0 px-8 overflow-hidden">
        <div className="flex justify-center items-center gap-8 max-w-7xl mx-auto">
          {/* Left Button - Client Portal */}
          <Button 
            onClick={() => navigate('/client-portal')}
            variant="outline" 
            className={`h-10 px-6 py-2 border-2 hover:bg-transparent transition-all duration-700 ease-in-out overflow-hidden ${
              logoHovered ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}
            style={{ 
              borderColor: '#b99364', 
              color: '#b99364',
              backgroundColor: 'transparent'
            }}
          >
            <Globe className="h-4 w-4 absolute -left-8 group-hover:left-2 transition-all duration-300 ease-in-out" />
            <span className="text-sm font-medium group-hover:ml-6 transition-all duration-300 ease-in-out">Client Portal</span>
          </Button>

          {/* Center Button - Photographers Portal */}
          <Button 
            onClick={() => navigate('/photographers')}
            variant="outline" 
            className={`h-10 px-6 py-2 border-2 hover:bg-transparent transition-all duration-700 ease-in-out overflow-hidden ${
              logoHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
            style={{ 
              borderColor: '#b99364', 
              color: '#b99364',
              backgroundColor: 'transparent'
            }}
          >
            <Users className="h-4 w-4 absolute -left-8 group-hover:left-2 transition-all duration-300 ease-in-out" />
            <span className="text-sm font-medium group-hover:ml-6 transition-all duration-300 ease-in-out">Photographers Portal</span>
          </Button>

          {/* Right Button - Hire a Teammate */}
          <Button 
            onClick={() => navigate('/hire')}
            variant="outline" 
            className={`h-10 px-6 py-2 border-2 hover:bg-transparent transition-all duration-700 ease-in-out overflow-hidden ${
              logoHovered ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
            style={{ 
              borderColor: '#b99364', 
              color: '#b99364',
              backgroundColor: 'transparent'
            }}
          >
            <UserPlus className="h-4 w-4 absolute -left-8 group-hover:left-2 transition-all duration-300 ease-in-out" />
            <span className="text-sm font-medium group-hover:ml-6 transition-all duration-300 ease-in-out">Hire a Teammate</span>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator - Absolutely positioned at bottom center */}
      <div 
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
          logoHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="w-6 h-10 border-2 rounded-full flex justify-center" style={{ borderColor: '#b99364' }}>
          <div className="w-1 h-3 rounded-full mt-2 animate-pulse" style={{ backgroundColor: '#b99364' }}></div>
        </div>
      </div>
    </section>
  );
}
