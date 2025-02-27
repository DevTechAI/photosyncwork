
import { User, FileText, Receipt, ChartBar, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stats/StatCard";
import { Link } from "react-router-dom";

export function ClientsTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clients"
          value="24"
          icon={User}
          trend={{ value: 3, label: "this month" }}
        />
        <StatCard
          title="Active Projects"
          value="8"
          icon={FileText}
          trend={{ value: 2, label: "vs last month" }}
        />
        <StatCard
          title="Pending Invoices"
          value="5"
          icon={Receipt}
          trend={{ value: -1, label: "vs last month" }}
        />
        <StatCard
          title="Completed Projects"
          value="16"
          icon={ChartBar}
          trend={{ value: 4, label: "this month" }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              {
                name: "Sharma Family",
                contact: {
                  phone: "+91 98765 43210",
                  email: "sharma@email.com"
                },
                projects: [
                  { name: "Wedding Photography", status: "In Progress", progress: 65 },
                  { name: "Pre-Wedding Shoot", status: "Completed", progress: 100 }
                ],
                estimates: 2,
                invoices: 1,
                activeProject: true
              },
              {
                name: "TechCo Solutions",
                contact: {
                  phone: "+91 98765 43211",
                  email: "techco@email.com"
                },
                projects: [
                  { name: "Product Launch Event", status: "Planning", progress: 25 }
                ],
                estimates: 1,
                invoices: 0,
                activeProject: true
              },
              {
                name: "Fashion Brand",
                contact: {
                  phone: "+91 98765 43212",
                  email: "fashion@email.com"
                },
                projects: [
                  { name: "Summer Collection", status: "Completed", progress: 100 },
                  { name: "Winter Catalog", status: "Planning", progress: 15 }
                ],
                estimates: 3,
                invoices: 2,
                activeProject: true
              }
            ].map((client) => (
              <div key={client.name} className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{client.name}</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        {client.contact.phone}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        {client.contact.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Link 
                      to="/estimates" 
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {client.estimates} Estimates
                    </Link>
                    <br />
                    <Link 
                      to="/invoices" 
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {client.invoices} Invoices
                    </Link>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Projects</h4>
                  {client.projects.map((project) => (
                    <div key={project.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{project.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.status === "Completed" 
                            ? "bg-green-100 text-green-800"
                            : project.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{project.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
