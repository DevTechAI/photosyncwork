
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const upcomingPayments = [
  { id: 1, client: "Sharma Wedding", amount: "₹45,000", due: "2024-05-20", status: "pending" },
  { id: 2, client: "Corporate Event", amount: "₹28,000", due: "2024-05-22", status: "overdue" },
  { id: 3, client: "Product Shoot", amount: "₹15,000", due: "2024-05-25", status: "pending" },
];

export function UpcomingPayments() {
  return (
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
  );
}
