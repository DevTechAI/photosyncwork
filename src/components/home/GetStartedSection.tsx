
import { Button } from "@/components/ui/button";
import { Camera, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GetStartedSection() {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#f7f5f2' }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8" style={{ color: '#1a2238' }}>
          Ready to Get Started?
        </h2>
        <p className="text-xl mb-12" style={{ color: '#999999' }}>
          Join thousands of photographers and videographers who have transformed their business with StudioSync.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Button 
            onClick={() => navigate('/photographers')}
            size="lg"
            className="h-16 text-lg text-white"
            style={{ backgroundColor: '#1a2238' }}
          >
            <Camera className="h-6 w-6 mr-2" />
            Start as a Photographer
          </Button>
          
          <Button 
            onClick={() => navigate('/client-portal')}
            variant="outline"
            size="lg"
            className="h-16 text-lg border-2"
            style={{ 
              borderColor: '#b99364', 
              color: '#b99364'
            }}
          >
            <Globe className="h-6 w-6 mr-2" />
            Access Client Portal
          </Button>
        </div>
      </div>
    </section>
  );
}
