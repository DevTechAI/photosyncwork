
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Users, Calendar, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f5f2' }}>
      {/* Header */}
      <header className="backdrop-blur-sm shadow-sm border-b border-gray-700/20" style={{ backgroundColor: '#0e0e11' }}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/b5a2c474-15f8-4a49-b102-73278d7c52f1.png" 
                alt="StudioSync Logo" 
                className="h-28 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/login')} 
                variant="outline" 
                className="border-2 hover:bg-transparent"
                style={{ 
                  borderColor: '#b99364', 
                  color: '#b99364',
                  backgroundColor: 'transparent'
                }}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#b99364' }}>
            Welcome to StudioSync
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#999999' }}>
            The complete platform for photographers, videographers, and their clients to collaborate seamlessly
          </p>
        </div>

        {/* Navigation Cards - Dark Section */}
        <div className="py-16 -mx-4 px-4" style={{ backgroundColor: '#1a2238' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Client Portal Card */}
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer backdrop-blur-sm border-2 hover:shadow-xl"
              style={{ 
                backgroundColor: '#f7f5f2', 
                borderColor: '#b99364'
              }}
              onClick={() => navigate('/client-portal')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full w-fit" style={{ backgroundColor: '#b99364' }}>
                  <Globe className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-2xl" style={{ color: '#1a2238' }}>Client Portal</CardTitle>
                <CardDescription className="text-base" style={{ color: '#999999' }}>
                  Access your project deliverables, view photos and videos, and provide feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm space-y-2 mb-6" style={{ color: '#999999' }}>
                  <li>✓ View and download your photos & videos</li>
                  <li>✓ Browse gallery of your events</li>
                  <li>✓ Provide feedback and approvals</li>
                  <li>✓ Track project progress</li>
                </ul>
                <Button 
                  className="w-full text-white border-2 hover:bg-transparent transition-colors" 
                  size="lg"
                  style={{ 
                    backgroundColor: '#556ee6',
                    borderColor: '#b99364'
                  }}
                >
                  Access Client Portal
                </Button>
              </CardContent>
            </Card>

            {/* Photographers Portal Card */}
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer backdrop-blur-sm border-2 hover:shadow-xl"
              style={{ 
                backgroundColor: '#f7f5f2', 
                borderColor: '#b99364'
              }}
              onClick={() => navigate('/photographers')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full w-fit" style={{ backgroundColor: '#b99364' }}>
                  <Users className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-2xl" style={{ color: '#1a2238' }}>Photographers Portal</CardTitle>
                <CardDescription className="text-base" style={{ color: '#999999' }}>
                  Manage your studio, clients, projects, and team collaboration
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm space-y-2 mb-6" style={{ color: '#999999' }}>
                  <li>✓ Project management & scheduling</li>
                  <li>✓ Client relationship management</li>
                  <li>✓ Team collaboration tools</li>
                  <li>✓ Financial tracking & invoicing</li>
                </ul>
                <Button 
                  className="w-full text-white border-2 hover:bg-transparent transition-colors" 
                  size="lg"
                  style={{ 
                    backgroundColor: '#556ee6',
                    borderColor: '#b99364'
                  }}
                >
                  Access Studio Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section - Light Section */}
        <div className="mt-16 text-center py-16">
          <h3 className="text-2xl font-bold mb-8" style={{ color: '#b99364' }}>Why Choose StudioSync?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 backdrop-blur-sm rounded-full w-fit" style={{ backgroundColor: '#b99364' }}>
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2" style={{ color: '#1a2238' }}>Streamlined Workflow</h4>
              <p style={{ color: '#999999' }}>From pre-production to delivery, manage every aspect of your photography business</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 backdrop-blur-sm rounded-full w-fit" style={{ backgroundColor: '#b99364' }}>
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2" style={{ color: '#1a2238' }}>Client Collaboration</h4>
              <p style={{ color: '#999999' }}>Keep clients engaged with real-time updates and seamless communication</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 backdrop-blur-sm rounded-full w-fit" style={{ backgroundColor: '#b99364' }}>
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2" style={{ color: '#1a2238' }}>Professional Tools</h4>
              <p style={{ color: '#999999' }}>Everything you need to run a successful photography or videography business</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Dark Section */}
      <footer className="backdrop-blur-sm border-t border-gray-700/20 mt-16" style={{ backgroundColor: '#0e0e11' }}>
        <div className="max-w-6xl mx-auto px-4 py-8 text-center" style={{ color: '#f7f5f2' }}>
          <p>&copy; 2024 StudioSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
