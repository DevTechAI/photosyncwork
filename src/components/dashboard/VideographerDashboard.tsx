
import { Video, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stats/StatCard";

export function VideographerDashboard() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Videographer Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your videography assignments and schedule
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Upcoming Shoots"
          value="3"
          icon={Video}
          trend={{ value: 1, label: "vs last week" }}
        />
        <StatCard
          title="Pending Edits"
          value="5"
          icon={FileText}
          trend={{ value: 2, label: "vs last week" }}
        />
        <StatCard
          title="Hours Scheduled"
          value="32"
          icon={Clock}
          trend={{ value: 4, label: "vs last week" }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Video Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Mehra Wedding Ceremony</h4>
              <p className="text-sm text-muted-foreground mt-1">
                May 23, 2024 • 8:00 AM - 9:00 PM
              </p>
              <div className="flex items-center mt-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Full Day Coverage
                </span>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Corporate Training Video</h4>
              <p className="text-sm text-muted-foreground mt-1">
                May 25, 2024 • 10:00 AM - 4:00 PM
              </p>
              <div className="flex items-center mt-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Corporate
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
