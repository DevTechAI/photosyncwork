
import { Camera, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stats/StatCard";

export function PhotographerDashboard() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Photographer Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your photography assignments and schedule
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Upcoming Sessions"
          value="4"
          icon={Camera}
          trend={{ value: 1, label: "vs last week" }}
        />
        <StatCard
          title="Pending Deliveries"
          value="2"
          icon={FileText}
          trend={{ value: -1, label: "vs last week" }}
        />
        <StatCard
          title="Hours Scheduled"
          value="24"
          icon={Clock}
          trend={{ value: 3, label: "vs last week" }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Sharma Wedding</h4>
              <p className="text-sm text-muted-foreground mt-1">
                May 20, 2024 • 10:00 AM - 6:00 PM
              </p>
              <div className="flex items-center mt-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Pre-Wedding Shoot
                </span>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Product Shoot - Fashion Brand</h4>
              <p className="text-sm text-muted-foreground mt-1">
                May 22, 2024 • 9:00 AM - 3:00 PM
              </p>
              <div className="flex items-center mt-2">
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  Commercial
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
