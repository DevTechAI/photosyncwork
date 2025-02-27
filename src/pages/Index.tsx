import Layout from "@/components/Layout";
import { StatCard } from "@/components/stats/StatCard";
import {
  DollarSign,
  FileText,
  Receipt,
  Users,
  TrendingUp,
  AlertCircle,
  Clock,
  Calendar,
  CheckSquare,
  Edit,
  Camera,
  Film,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the chart - replace with real data later
const revenueData = [
  { month: 'Jan', revenue: 24000 },
  { month: 'Feb', revenue: 28000 },
  { month: 'Mar', revenue: 32000 },
  { month: 'Apr', revenue: 38000 },
  { month: 'May', revenue: 42000 },
  { month: 'Jun', revenue: 48000 },
];

// Sample data for upcoming payments - replace with real data later
const upcomingPayments = [
  { id: 1, client: "Sharma Wedding", amount: "₹45,000", due: "2024-05-20", status: "pending" },
  { id: 2, client: "Corporate Event", amount: "₹28,000", due: "2024-05-22", status: "overdue" },
  { id: 3, client: "Product Shoot", amount: "₹15,000", due: "2024-05-25", status: "pending" },
];

export default function Index() {
  const { currentUser } = useUser();

  // Manager Dashboard - Enhanced with financial overview
  if (currentUser?.role === "manager" || currentUser?.role === "accounts") {
    return (
      <Layout>
        <div className="space-y-8 animate-in">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Financial Overview</h1>
            <p className="text-muted-foreground mt-2">
              Track your business performance and financial health
            </p>
          </div>

          {/* Key Metrics */}
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

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity and Upcoming Payments */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Upcoming Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingPayments.map((payment) => (
                    <div 
                      key={payment.id} 
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{payment.client}</h4>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(payment.due).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{payment.amount}</p>
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${
                            payment.status === 'overdue' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full mt-4" variant="outline" asChild>
                    <Link to="/invoices">View All Invoices</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/estimates">
                    <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-4">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div className="text-left">
                        <div className="font-medium">New Estimate</div>
                        <div className="text-xs text-muted-foreground">Create client quote</div>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/invoices">
                    <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-4">
                      <Receipt className="h-5 w-5 text-green-500" />
                      <div className="text-left">
                        <div className="font-medium">New Invoice</div>
                        <div className="text-xs text-muted-foreground">Bill a client</div>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/finances">
                    <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-4">
                      <DollarSign className="h-5 w-5 text-purple-500" />
                      <div className="text-left">
                        <div className="font-medium">Track Expense</div>
                        <div className="text-xs text-muted-foreground">Record new expense</div>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/finances">
                    <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-4">
                      <TrendingUp className="h-5 w-5 text-amber-500" />
                      <div className="text-left">
                        <div className="font-medium">Reports</div>
                        <div className="text-xs text-muted-foreground">View analytics</div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // CRM Dashboard
  if (currentUser?.role === "crm") {
    return (
      <Layout>
        <div className="space-y-8 animate-in">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Client Relations Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome to your client and project management overview.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Active Clients"
              value="24"
              icon={Users}
              trend={{ value: 4, label: "vs last month" }}
            />
            <StatCard
              title="New Leads"
              value="12"
              icon={FileText}
              trend={{ value: 3, label: "vs last month" }}
            />
            <StatCard
              title="Upcoming Events"
              value="8"
              icon={Calendar}
              trend={{ value: -1, label: "vs last month" }}
            />
            <StatCard
              title="Ongoing Projects"
              value="6"
              icon={Camera}
              trend={{ value: 2, label: "vs last month" }}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Client Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span>Active Estimates</span>
                    </div>
                    <span className="font-medium">9</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <span>Events This Month</span>
                    </div>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Film className="h-5 w-5 text-purple-500" />
                      <span>Post-Production</span>
                    </div>
                    <span className="font-medium">7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-amber-500" />
                      <span>Completed Jobs</span>
                    </div>
                    <span className="font-medium">34</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/estimates">
                    <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-4">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div className="text-left">
                        <div className="font-medium">New Estimate</div>
                        <div className="text-xs text-muted-foreground">Create client quote</div>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/pre-production">
                    <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-4">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <div className="text-left">
                        <div className="font-medium">Schedule Event</div>
                        <div className="text-xs text-muted-foreground">Plan production</div>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/production">
                    <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-4">
                      <Camera className="h-5 w-5 text-purple-500" />
                      <div className="text-left">
                        <div className="font-medium">Assignments</div>
                        <div className="text-xs text-muted-foreground">Manage team</div>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/post-production">
                    <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-4">
                      <Film className="h-5 w-5 text-amber-500" />
                      <div className="text-left">
                        <div className="font-medium">Deliverables</div>
                        <div className="text-xs text-muted-foreground">Track edits</div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Photographer Dashboard
  if (currentUser?.role === "photographer") {
    return (
      <Layout>
        <div className="space-y-8 animate-in">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Photographer Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome to your production and assignments overview.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="text-xl font-bold">3</h3>
                <p className="text-sm text-muted-foreground">Upcoming Shoots</p>
              </div>
            </Card>
            <Card className="p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <CheckSquare className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="text-xl font-bold">5</h3>
                <p className="text-sm text-muted-foreground">Completed Shoots</p>
              </div>
            </Card>
            <Card className="p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <Clock className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="text-xl font-bold">18</h3>
                <p className="text-sm text-muted-foreground">Hours Logged</p>
              </div>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>My Upcoming Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Sharma Wedding</h4>
                      <p className="text-sm text-muted-foreground">May 15, 2024 • 10:00 AM - 6:00 PM</p>
                      <p className="text-sm mt-1">Grand Hyatt, Mumbai</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Wedding</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Product Photoshoot</h4>
                      <p className="text-sm text-muted-foreground">May 18, 2024 • 1:00 PM - 5:00 PM</p>
                      <p className="text-sm mt-1">Studio 5, Andheri</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Commercial</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Anniversary Celebration</h4>
                      <p className="text-sm text-muted-foreground">May 22, 2024 • 5:00 PM - 9:00 PM</p>
                      <p className="text-sm mt-1">Taj Lands End, Bandra</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Event</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/production">
                  <Button className="w-full">
                    View All Assignments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Videographer Dashboard
  if (currentUser?.role === "videographer") {
    return (
      <Layout>
        <div className="space-y-8 animate-in">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Videographer Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome to your video production and assignments overview.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="text-xl font-bold">2</h3>
                <p className="text-sm text-muted-foreground">Upcoming Shoots</p>
              </div>
            </Card>
            <Card className="p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <CheckSquare className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="text-xl font-bold">3</h3>
                <p className="text-sm text-muted-foreground">Completed Shoots</p>
              </div>
            </Card>
            <Card className="p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <Clock className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="text-xl font-bold">15</h3>
                <p className="text-sm text-muted-foreground">Hours Logged</p>
              </div>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>My Upcoming Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Corporate Event - TechCo</h4>
                      <p className="text-sm text-muted-foreground">May 20, 2024 • 9:00 AM - 5:00 PM</p>
                      <p className="text-sm mt-1">Hotel Sahara Star, Mumbai</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Corporate</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Restaurant Promo</h4>
                      <p className="text-sm text-muted-foreground">May 25, 2024 • 2:00 PM - 7:00 PM</p>
                      <p className="text-sm mt-1">Spice Garden, Juhu</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Commercial</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/production">
                  <Button className="w-full">
                    View All Assignments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Editor Dashboard
  if (currentUser?.role === "editor") {
    return (
      <Layout>
        <div className="space-y-8 animate-in">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Editor Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome to your post-production and deliverables overview.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <Edit className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="text-xl font-bold">4</h3>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </Card>
            <Card className="p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <CheckSquare className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="text-xl font-bold">12</h3>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </Card>
            <Card className="p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <Clock className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="text-xl font-bold">22</h3>
                <p className="text-sm text-muted-foreground">Hours Logged</p>
              </div>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>My Current Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Mehta Family Portrait</h4>
                      <p className="text-sm text-muted-foreground">Due: May 18, 2024</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Photo Editing</div>
                        <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">In Progress</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Wedding Highlights</h4>
                      <p className="text-sm text-muted-foreground">Due: May 22, 2024</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Video Editing</div>
                        <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">In Progress</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Corporate Event Recap</h4>
                      <p className="text-sm text-muted-foreground">Due: May 25, 2024</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Video Editing</div>
                        <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Pending</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Portfolio Edits</h4>
                      <p className="text-sm text-muted-foreground">Due: May 30, 2024</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Photo Editing</div>
                        <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Revision Requested</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/post-production">
                  <Button className="w-full">
                    View All Deliverables
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Default Dashboard (fallback)
  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your photography business dashboard.
          </p>
        </div>

        <Card className="p-6 text-center">
          <h2 className="text-xl font-medium mb-2">Welcome to PhotoFin</h2>
          <p className="text-muted-foreground">
            Your photography business management solution
          </p>
        </Card>
      </div>
    </Layout>
  );
}
