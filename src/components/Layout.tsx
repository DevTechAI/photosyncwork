
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

// Define navigation items with access control
const navItems = [
  { path: "/", label: "Dashboard", icon: Home, access: ["all"] },
  { path: "/estimates", label: "Estimates", icon: FileText, access: ["manager", "crm"] },
  { path: "/invoices", label: "Invoices", icon: Receipt, access: ["manager", "accounts"] },
  { path: "/finances", label: "Finances", icon: LineChart, access: ["manager", "accounts"] },
  { path: "/scheduling", label: "Scheduling", icon: Calendar, access: ["manager", "crm"] },
  { path: "/pre-production", label: "Pre-Production", icon: Calendar, access: ["manager", "crm"] },
  { path: "/production", label: "Production", icon: Camera, access: ["manager", "crm", "photographer", "videographer"] },
  { path: "/post-production", label: "Post-Production", icon: Film, access: ["manager", "crm", "editor"] },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, hasAccess } = useUser();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [currentUser, location.pathname, navigate]);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  // If user not authenticated, don't render the layout
  if (!currentUser) {
    return null;
  }
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (item.access.includes("all")) return true;
    if (currentUser.role === "manager") return true;
    return item.access.includes(currentUser.role);
  });

  // Determine if we're on a page that should have a back to dashboard button
  const showBackToDashboard = location.pathname !== "/" && !location.pathname.startsWith("/login");
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card/80 backdrop-blur-xl border-r transition-transform duration-300 ease-in-out z-40",
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
              <div className="font-medium truncate">{currentUser.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{currentUser.role}</div>
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

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Top bar for mobile navigation (only visible on mobile) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-yellow border-b z-30 flex items-center px-4">
        <div className="flex-1 flex items-center">
          {showBackToDashboard && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2" 
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
          )}
          <h1 className="text-xl font-semibold text-velvet-dark">StudioSync</h1>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-velvet-dark hover:bg-yellow-light">
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
