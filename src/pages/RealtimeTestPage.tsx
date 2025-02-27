
import Layout from "@/components/Layout";
import { RealtimeTest } from "@/components/realtime/RealtimeTest";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RealtimeTestPage() {
  const { currentUser, login } = useUser();
  const navigate = useNavigate();

  // Demo login functionality
  const handleDemoLogin = () => {
    login("admin@example.com");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Realtime Testing</h1>
            <p className="text-sm text-muted-foreground">
              Test realtime messaging functionality using Supabase's realtime features
            </p>
          </div>
          
          {!currentUser && (
            <Button onClick={handleDemoLogin}>
              Login as Demo User
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <RealtimeTest />
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">How to test:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Login using the demo user button (if not logged in)</li>
              <li>Open this page in multiple browser tabs or devices</li>
              <li>Send messages from any tab</li>
              <li>See messages appear instantly in all tabs without refreshing</li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
}
