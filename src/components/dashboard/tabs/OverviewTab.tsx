
import { FileText, Users, DollarSign, Calendar, Camera, Video, Edit, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stats/StatCard";

export function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Projects"
          value="15"
          icon={FileText}
          trend={{ value: 3, label: "vs last month" }}
        />
        <StatCard
          title="Team Members"
          value="12"
          icon={Users}
          trend={{ value: 2, label: "vs last month" }}
        />
        <StatCard
          title="Monthly Revenue"
          value="₹2,48,000"
          icon={DollarSign}
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatCard
          title="Upcoming Events"
          value="8"
          icon={Calendar}
          trend={{ value: 1, label: "vs last month" }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium">Mehra Wedding</h4>
                <p className="text-sm text-muted-foreground mt-1">May 23, 2024</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Photography
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    Videography
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-500" />
                  <span>Photographers</span>
                </div>
                <span className="text-sm">4 Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-purple-500" />
                  <span>Videographers</span>
                </div>
                <span className="text-sm">3 Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit className="h-4 w-4 text-green-500" />
                  <span>Editors</span>
                </div>
                <span className="text-sm">5 Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Link to="/scheduling">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Event
                </Button>
              </Link>
              <Link to="/estimates">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Estimate
                </Button>
              </Link>
              <Link to="/invoices">
                <Button variant="outline" className="w-full justify-start">
                  <Receipt className="h-4 w-4 mr-2" />
                  Generate Invoice
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
