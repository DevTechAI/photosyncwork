
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  FileText, 
  UserCircle, 
  CreditCard, 
  Calendar, 
  Settings,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: BarChart,
  },
  {
    title: "Estimates",
    href: "/estimates",
    icon: FileText,
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: CreditCard,
  },
  {
    title: "Scheduling",
    href: "/scheduling",
    icon: Calendar,
  },
];

const otherNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const location = useLocation();
  
  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r bg-background lg:flex lg:flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg font-semibold tracking-tight">StudioSync</span>
        </Link>
      </div>
      
      <nav className="flex-1 overflow-auto p-3">
        <div className="mb-4">
          <div className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
            Main
          </div>
          <div className="grid gap-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-muted",
                  isActive(item.href) ? "bg-muted" : "transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
            Preferences
          </div>
          <div className="grid gap-1">
            {otherNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-muted",
                  isActive(item.href) ? "bg-muted" : "transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3">
          <UserCircle className="h-9 w-9 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-muted-foreground">admin@studiosync.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
