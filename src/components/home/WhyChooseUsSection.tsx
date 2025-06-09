
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Camera, UserPlus } from "lucide-react";

export function WhyChooseUsSection() {
  return (
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
  );
}
