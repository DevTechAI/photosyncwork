import { Button } from "@/components/ui/button";
import { Globe, Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { WebGLBackground } from "./WebGLBackground";
import { WorkInProgress } from "@/components/ui/WorkInProgress";

export function HeroSection() {
  const navigate = useNavigate();
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* WebGL Background - Full Screen */}
      <WebGLBackground />
      
      {/* Gradient Overlay - Reduced opacity to show WebGL background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dustyBlue-whisper/40 via-warmWhite/30 to-sage-light/20 z-10"></div>
      
      {/* Logo */}
      <div 
        className="mb-12 cursor-pointer transition-all duration-300 hover:scale-105 z-20 relative"
        onMouseEnter={() => setButtonsVisible(true)}
      >
        <img 
          src="/photosyncwork-logo.svg" 
          alt="PhotoSyncWork Logo" 
          className="h-24 md:h-32 w-auto object-contain mx-auto drop-shadow-lg"
        />
      </div>

      {/* Work in Progress Banner */}
      <div className="mb-8 z-20 relative">
        <WorkInProgress 
          variant="banner" 
          size="lg" 
          className="mx-auto w-fit"
        />
      </div>

      {/* Three Main Buttons - Bottom of Screen */}
      <div className="absolute bottom-16 left-0 right-0 px-4 md:px-8 overflow-hidden z-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-8 max-w-xs md:max-w-7xl mx-auto relative">
          {/* Left Button - Client Portal */}
          <Button 
            onClick={() => navigate('/client-portal')}
            variant="outline" 
            className={`group h-9 md:h-10 px-4 md:px-6 py-2 border-2 text-xs md:text-sm transition-all duration-700 ease-in-out overflow-hidden bg-dustyBlue-whisper/70 backdrop-blur-md hover:bg-dustyBlue-soft hover:shadow-xl hover:px-8 md:hover:px-10 ${
              buttonsVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}
            style={{ 
              borderColor: 'hsl(var(--dusty-blue))', 
              color: 'hsl(var(--dusty-blue-dark))'
            }}
          >
            <div className="flex items-center justify-center w-full relative">
              <Globe className="h-3 w-3 md:h-4 md:w-4 absolute left-0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <span className="font-medium font-playfair whitespace-nowrap group-hover:ml-6">Client Portal</span>
            </div>
          </Button>

          {/* Center Button - Photographers Portal */}
          <Button 
            onClick={() => navigate('/photographers')}
            variant="outline" 
            className={`group h-9 md:h-10 px-4 md:px-6 py-2 border-2 text-xs md:text-sm transition-all duration-700 ease-in-out overflow-hidden md:absolute md:left-1/2 md:transform md:-translate-x-1/2 bg-dustyBlue-whisper/70 backdrop-blur-md hover:bg-dustyBlue-soft hover:shadow-xl hover:px-8 md:hover:px-12 ${
              buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
            style={{ 
              borderColor: 'hsl(var(--dusty-blue))', 
              color: 'hsl(var(--dusty-blue-dark))'
            }}
          >
            <div className="flex items-center justify-center w-full relative">
              <Users className="h-3 w-3 md:h-4 md:w-4 absolute left-0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <span className="font-medium font-playfair whitespace-nowrap group-hover:ml-6">Photographers Portal</span>
            </div>
          </Button>

          {/* Right Button - Hire a Teammate */}
          <Button 
            onClick={() => navigate('/hire')}
            variant="outline" 
            className={`group h-9 md:h-10 px-4 md:px-6 py-2 border-2 text-xs md:text-sm transition-all duration-700 ease-in-out overflow-hidden bg-dustyBlue-whisper/70 backdrop-blur-md hover:bg-dustyBlue-soft hover:shadow-xl hover:px-8 md:hover:px-10 ${
              buttonsVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
            style={{ 
              borderColor: 'hsl(var(--dusty-blue))', 
              color: 'hsl(var(--dusty-blue-dark))'
            }}
          >
            <div className="flex items-center justify-center w-full relative">
              <UserPlus className="h-3 w-3 md:h-4 md:w-4 absolute left-0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <span className="font-medium font-playfair whitespace-nowrap group-hover:ml-6">Hire a Teammate</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator - Aligned with center button */}
      <div 
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 z-20 ${
          buttonsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 rounded-full flex justify-center backdrop-blur-sm" style={{ borderColor: 'hsl(var(--dusty-blue))' }}>
          <div className="w-1 h-2 md:h-3 rounded-full mt-2 animate-pulse" style={{ backgroundColor: 'hsl(var(--dusty-blue))' }}></div>
        </div>
      </div>
    </section>
  );
}