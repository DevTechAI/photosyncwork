import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  FileText,
  Receipt,
  LineChart,
  Home,
  Menu,
  X,
  Calendar,
  Camera,
  Film,
  FileCheck,
  LogOut,
  User,
  ArrowLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

// Define navigation items with access control
const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: Home, access: ["all"] },
  { path: "/estimates", label: "Estimates", icon: FileText, access: ["manager", "crm"] },
  { path: "/invoices", label: "Invoices", icon: Receipt, access: ["manager", "accounts"] },
  { path: "/finances", label: "Finances", icon: LineChart, access: ["manager", "accounts"] },
  { path: "/workflow", label: "Workflow", icon: Calendar, access: ["all"] },
  { path: "/portfolio", label: "Portfolio", icon: Camera, access: ["all"] },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth(); // Use Auth context instead of UserContext
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  // If user not authenticated, don't render the layout
  if (!user) {
    return null;
  }
  
  // Handle logout
  const handleLogout = () => {
    signOut();
    navigate("/auth");
  };
  
  // Determine if we're on a page that should have a back to dashboard button
  const showBackToDashboard = location.pathname !== "/dashboard" && !location.pathname.startsWith("/auth");
  
  // Get user role from email (for bypass mode)
  const getUserRole = () => {
    if (!user || !user.email) return 'user';
    
    const email = user.email.toLowerCase();
    if (email.includes('manager')) return 'manager';
    if (email.includes('accounts')) return 'accounts';
    if (email.includes('crm')) return 'crm';
    if (email.includes('photographer')) return 'photographer';
    if (email.includes('videographer')) return 'videographer';
    if (email.includes('editor')) return 'editor';
    
    return 'manager'; // Default to manager
  };
  
  const userRole = getUserRole();
  
  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (item.access.includes("all")) return true;
    if (userRole === "manager") return true;
    return item.access.includes(userRole);
  });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation - Always on the left */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card border-r transition-transform duration-300 ease-in-out z-40",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <nav className="flex flex-col h-full p-4">
          <div className="space-y-2 py-4">
            <h1 className="text-2xl font-semibold px-2">StudioSync</h1>
            <p className="text-sm text-muted-foreground px-2">Studio Success System</p>
          </div>
          
          <div className="space-y-1 py-2 flex-1 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                    location.pathname === item.path
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50 text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="mt-auto border-t pt-4">
            <div className="px-2 py-2 mb-2">
              <div className="font-medium truncate">{user.user_metadata?.full_name || user.email}</div>
              <div className="text-xs text-muted-foreground capitalize">{userRole}</div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Logout</span>
            </Button>
          </div>
        </nav>
      </aside>

      {/* Mobile Menu Button - Positioned on the left */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Top bar for mobile navigation (only visible on mobile) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-30 flex items-center px-4">
        <div className="flex-1 flex items-center ml-12"> {/* Added margin-left to accommodate the menu button */}
          {showBackToDashboard && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-2 border-2 bg-gray-50 hover:bg-gray-100 hover:shadow-sm transition-all duration-300" 
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
          )}
          <h1 className="text-xl font-semibold">StudioSync</h1>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        "flex-1 min-h-screen transition-all duration-300 ease-in-out",
        "lg:ml-64 p-4 lg:p-6", 
        "lg:pt-6 pt-20" // Add top padding on mobile for the header
      )}>
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}