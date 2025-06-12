
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Camera, User, Settings, LogOut, Home, FileText, Calendar, Receipt, DollarSign, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatStorageUsed = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <Camera className="h-6 w-6" />
            <span className="font-semibold">StudioSync</span>
          </Link>

          {user && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Business</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px]">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                        >
                          <Home className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Dashboard</div>
                            <div className="text-xs text-muted-foreground">Overview & analytics</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/estimates"
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                        >
                          <FileText className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Estimates</div>
                            <div className="text-xs text-muted-foreground">Create & manage quotes</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/invoices"
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                        >
                          <Receipt className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Invoices</div>
                            <div className="text-xs text-muted-foreground">Billing & payments</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/finances"
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                        >
                          <DollarSign className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Finances</div>
                            <div className="text-xs text-muted-foreground">Financial management</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Workflow</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px]">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/scheduling"
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                        >
                          <Calendar className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Scheduling</div>
                            <div className="text-xs text-muted-foreground">Calendar & events</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/portfolio"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
                    >
                      <Briefcase className="h-4 w-4" />
                      Portfolio
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user.email || ''} />
                  <AvatarFallback>
                    {profile?.full_name 
                      ? getInitials(profile.full_name)
                      : user.email?.charAt(0).toUpperCase() || 'U'
                    }
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{profile?.full_name || user.email}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  {profile && (
                    <p className="text-xs text-muted-foreground">
                      Storage: {formatStorageUsed(profile.storage_used)} / {formatStorageUsed(profile.storage_limit)}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
