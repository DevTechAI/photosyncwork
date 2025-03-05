import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import {
  Home,
  LayoutDashboard,
  Package,
  KanbanSquare,
  ListChecks,
  CreditCard,
  Calendar,
  Settings,
  Menu,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

export function Sidebar() {
  const { pathname } = useLocation();
  const { currentUser, logout } = useUser();

  // Navigation links
  const navLinks = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      title: "Estimates",
      href: "/estimates",
      icon: ListChecks,
      active: pathname === "/estimates",
    },
    {
      title: "Invoices",
      href: "/invoices",
      icon: CreditCard,
      active: pathname === "/invoices",
    },
    {
      title: "Workflow",
      href: "/workflow",
      icon: KanbanSquare,
      active: pathname.startsWith("/workflow"),
    },
    {
      title: "Scheduling",
      href: "/scheduling",
      icon: Calendar,
      active: pathname === "/scheduling",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ];

  return (
    <div className="border-r flex-col hidden md:flex w-64">
      <div className="flex items-center gap-2 px-4 py-6">
        <Home className="h-6 w-6" />
        <span className="text-lg font-semibold">Focus Photography</span>
      </div>
      <nav className="flex flex-col gap-4 px-4">
        {navLinks.map((link) => (
          <NavLink
            key={link.title}
            to={link.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary ${
              link.active ? "bg-secondary font-medium" : ""
            }`}
          >
            <link.icon className="h-4 w-4" />
            {link.title}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t px-4 py-6">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{currentUser?.name}</span>
            <span className="text-xs text-muted-foreground">
              {currentUser?.email}
            </span>
          </div>
        </div>
        <button className="w-full py-2 mt-4 text-sm rounded-md bg-secondary hover:bg-secondary/80" onClick={logout}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const { pathname } = useLocation();
    const { currentUser, logout } = useUser();

  // Navigation links
  const navLinks = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      title: "Estimates",
      href: "/estimates",
      icon: ListChecks,
      active: pathname === "/estimates",
    },
    {
      title: "Invoices",
      href: "/invoices",
      icon: CreditCard,
      active: pathname === "/invoices",
    },
    {
      title: "Workflow",
      href: "/workflow",
      icon: KanbanSquare,
      active: pathname.startsWith("/workflow"),
    },
    {
      title: "Scheduling",
      href: "/scheduling",
      icon: Calendar,
      active: pathname === "/scheduling",
    },
        {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ];

  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader className="px-4 pb-4">
          <SheetTitle>Focus Photography</SheetTitle>
          <SheetDescription>
            Manage your account settings and set preferences.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-4 px-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.title}
              to={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary ${
                link.active ? "bg-secondary font-medium" : ""
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.title}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t px-4 py-6">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{currentUser?.name}</span>
              <span className="text-xs text-muted-foreground">
                {currentUser?.email}
              </span>
            </div>
          </div>
          <button className="w-full py-2 mt-4 text-sm rounded-md bg-secondary hover:bg-secondary/80" onClick={logout}>
            Log Out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
