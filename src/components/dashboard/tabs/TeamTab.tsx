
import { Users, Camera, Video, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stats/StatCard";

export function TeamTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Staff"
          value="12"
          icon={Users}
          trend={{ value: 2, label: "new this month" }}
        />
        <StatCard
          title="Photographers"
          value="4"
          icon={Camera}
          trend={{ value: 1, label: "vs last month" }}
        />
        <StatCard
          title="Videographers"
          value="3"
          icon={Video}
          trend={{ value: 0, label: "vs last month" }}
        />
        <StatCard
          title="Editors"
          value="5"
          icon={Edit}
          trend={{ value: 1, label: "vs last month" }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Workload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Ankit Patel", role: "Photographer", tasks: 3, availability: "High" },
              { name: "Priya Singh", role: "Videographer", tasks: 4, availability: "Medium" },
              { name: "Rahul Sharma", role: "Editor", tasks: 5, availability: "Low" }
            ].map((member) => (
              <div key={member.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{member.tasks} Active Tasks</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.availability === 'High' ? 'bg-green-100 text-green-800' :
                    member.availability === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {member.availability} Availability
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
