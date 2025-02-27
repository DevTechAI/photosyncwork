
import { Card } from "@/components/ui/card";

export function DefaultDashboard() {
  return (
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
  );
}
