
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Receipt, TrendingUp } from "lucide-react";

export function QuickActions() {
  return (
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
          <Link to="/expenses">
            <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-4">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <div className="text-left">
                <div className="font-medium">Track Expense</div>
                <div className="text-xs text-muted-foreground">Record new expense</div>
              </div>
            </Button>
          </Link>
          <Link to="/reports">
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
  );
}
