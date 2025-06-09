
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Users, Calendar, Globe, UserPlus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [logoHovered, setLogoHovered] = useState(false);
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a2238' }}>
      {/* Hero Section - Full Screen */}
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

        {/* Scroll Indicator - Only show when logo is hovered */}
        <div 
          className={`absolute bottom-24 transition-all duration-500 ${
            logoHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="w-6 h-10 border-2 rounded-full flex justify-center" style={{ borderColor: '#b99364' }}>
            <div className="w-1 h-3 rounded-full mt-2 animate-pulse" style={{ backgroundColor: '#b99364' }}></div>
          </div>
        </div>

        {/* Three Main Buttons - Bottom of Screen */}
        <div className="absolute bottom-8 left-0 right-0 px-8 overflow-hidden">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
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
      </section>

      {/* About Us Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#f7f5f2' }}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8" style={{ color: '#1a2238' }}>
            About StudioSync
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-12" style={{ color: '#999999' }}>
            StudioSync is the complete platform designed for photographers, videographers, and their clients. 
            We streamline every aspect of your creative business, from initial consultation to final delivery, 
            making collaboration seamless and professional.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 rounded-full w-fit" style={{ backgroundColor: '#b99364' }}>
                <Camera className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#1a2238' }}>For Creatives</h3>
              <p style={{ color: '#999999' }}>
                Manage your entire workflow from scheduling to delivery. Handle clients, projects, 
                team collaboration, and financial tracking all in one place.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 rounded-full w-fit" style={{ backgroundColor: '#b99364' }}>
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#1a2238' }}>For Clients</h3>
              <p style={{ color: '#999999' }}>
                Stay connected with your photographer throughout the entire process. View progress, 
                provide feedback, and access your deliverables through a beautiful client portal.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 rounded-full w-fit" style={{ backgroundColor: '#b99364' }}>
                <Globe className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#1a2238' }}>For Teams</h3>
              <p style={{ color: '#999999' }}>
                Scale your business by collaborating with other photographers, editors, and specialists. 
                Find talent or offer your services through our marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#1a2238' }}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8" style={{ color: '#b99364' }}>
            Why Choose StudioSync?
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-16" style={{ color: '#f7f5f2' }}>
            We understand the unique challenges of running a creative business. That's why we've built 
            a platform that addresses every aspect of your workflow.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-2" style={{ backgroundColor: '#f7f5f2', borderColor: '#b99364' }}>
              <CardHeader>
                <div className="mx-auto mb-4 p-3 rounded-full w-fit" style={{ backgroundColor: '#b99364' }}>
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg" style={{ color: '#1a2238' }}>Streamlined Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm" style={{ color: '#999999' }}>
                  From booking to delivery, manage every step of your creative process in one platform.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2" style={{ backgroundColor: '#f7f5f2', borderColor: '#b99364' }}>
              <CardHeader>
                <div className="mx-auto mb-4 p-3 rounded-full w-fit" style={{ backgroundColor: '#b99364' }}>
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg" style={{ color: '#1a2238' }}>Client Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm" style={{ color: '#999999' }}>
                  Keep clients engaged with real-time updates and seamless communication tools.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2" style={{ backgroundColor: '#f7f5f2', borderColor: '#b99364' }}>
              <CardHeader>
                <div className="mx-auto mb-4 p-3 rounded-full w-fit" style={{ backgroundColor: '#b99364' }}>
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg" style={{ color: '#1a2238' }}>Professional Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm" style={{ color: '#999999' }}>
                  Access industry-leading tools for project management, financial tracking, and team coordination.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2" style={{ backgroundColor: '#f7f5f2', borderColor: '#b99364' }}>
              <CardHeader>
                <div className="mx-auto mb-4 p-3 rounded-full w-fit" style={{ backgroundColor: '#b99364' }}>
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg" style={{ color: '#1a2238' }}>Talent Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm" style={{ color: '#999999' }}>
                  Connect with skilled photographers, editors, and specialists to grow your business.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
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

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-700/20" style={{ backgroundColor: '#0e0e11' }}>
        <div className="max-w-6xl mx-auto text-center" style={{ color: '#f7f5f2' }}>
          <p>&copy; 2024 StudioSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
