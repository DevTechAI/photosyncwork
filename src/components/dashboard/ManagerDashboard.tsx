
import { 
  DollarSign, 
  FileText, 
  Receipt, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  Users, 
  Camera, 
  Video,
  Edit,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stats/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ManagerDashboard() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Manager Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Complete overview of your business operations
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Active Projects"
              value="15"
              icon={FileText}
              trend={{ value: 3, label: "vs last month" }}
            />
            <StatCard
              title="Completed"
              value="8"
              icon={FileText}
              trend={{ value: 2, label: "this month" }}
            />
            <StatCard
              title="In Progress"
              value="5"
              icon={Clock}
              trend={{ value: -1, label: "vs last month" }}
            />
            <StatCard
              title="Upcoming"
              value="2"
              icon={Calendar}
              trend={{ value: 0, label: "vs last month" }}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Mehra Wedding", type: "Wedding", stage: "Pre-Production", progress: 75 },
                  { name: "TechCo Product Launch", type: "Corporate", stage: "Production", progress: 45 },
                  { name: "Fashion Catalog", type: "Commercial", stage: "Post-Production", progress: 90 }
                ].map((project) => (
                  <div key={project.name} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{project.name}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {project.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{project.stage}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value="₹2,48,000"
              icon={DollarSign}
              trend={{ value: 12, label: "vs last month" }}
            />
            <StatCard
              title="Outstanding"
              value="₹88,000"
              icon={AlertCircle}
              trend={{ value: -5, label: "vs last month" }}
            />
            <StatCard
              title="Upcoming Payments"
              value="₹1,25,000"
              icon={Clock}
              trend={{ value: 8, label: "vs last month" }}
            />
            <StatCard
              title="Active Estimates"
              value="12"
              icon={FileText}
              trend={{ value: 2, label: "vs last month" }}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { client: "Sharma Wedding", amount: "₹45,000", type: "income", date: "May 15" },
                    { client: "Equipment Purchase", amount: "₹28,000", type: "expense", date: "May 14" },
                    { client: "Corporate Event", amount: "₹35,000", type: "income", date: "May 12" }
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{transaction.client}</h4>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                      <p className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                        {transaction.type === "income" ? "+" : "-"} {transaction.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <Link to="/invoices">
                    <Button variant="outline" className="w-full justify-start">
                      <Receipt className="h-4 w-4 mr-2" />
                      Generate Invoice
                    </Button>
                  </Link>
                  <Link to="/expenses">
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Record Expense
                    </Button>
                  </Link>
                  <Link to="/reports">
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
