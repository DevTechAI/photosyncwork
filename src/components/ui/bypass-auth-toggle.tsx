import { Button } from "@/components/ui/button";
import { useBypassAuth } from "@/contexts/BypassAuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Shield, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BypassAuthToggle() {
  const { bypassEnabled, toggleBypass, setMockRole, currentRole, availableRoles } = useBypassAuth();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Don't show the toggle if a real user is logged in
  if (user && !bypassEnabled) {
    return null;
  }

  const handleToggle = () => {
    toggleBypass();
    // Redirect to home page when toggling
    navigate("/");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {bypassEnabled ? (
        <div className="flex flex-col items-end space-y-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200">
                <Shield className="h-4 w-4 mr-2" />
                Role: {currentRole}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableRoles.map((role) => (
                <DropdownMenuItem 
                  key={role}
                  onClick={() => setMockRole(role)}
                  className={currentRole === role ? "bg-muted" : ""}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleToggle}
          >
            Disable Bypass
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
          onClick={handleToggle}
        >
          <Shield className="h-4 w-4 mr-2" />
          Enable Bypass Login
        </Button>
      )}
    </div>
  );
}