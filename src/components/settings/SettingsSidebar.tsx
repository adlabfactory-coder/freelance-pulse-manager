
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Building,
  PackageOpen,
  DollarSign,
  Calendar,
  Database,
  UserPlus,
  Shield,
  User,
  UserCog,
} from "lucide-react";
import UserSelector from "./UserSelector";
import { useAuth } from "@/hooks/use-auth";

interface SettingsSidebarProps {
  currentUserId: string;
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  currentUserId,
  selectedUserId,
  onSelectUser,
}) => {
  const location = useLocation();
  const { isAdmin, isSuperAdmin, isAdminOrSuperAdmin } = useAuth();

  // Base navigation items for all users
  const baseNavigation = [
    {
      name: "Profil",
      href: "/settings/profile",
      icon: User,
      current: location.pathname === "/settings/profile" || location.pathname === "/settings",
    },
  ];

  // Navigation items for admins and super admins
  const adminNavigation = [
    {
      name: "Entreprise",
      href: "/settings/company",
      icon: Building,
      current: location.pathname === "/settings/company",
    },
    {
      name: "Services",
      href: "/settings/services",
      icon: PackageOpen,
      current: location.pathname === "/settings/services",
    },
    {
      name: "Commissions",
      href: "/settings/commissions",
      icon: DollarSign,
      current: location.pathname === "/settings/commissions",
    },
    {
      name: "Calendrier",
      href: "/settings/schedule",
      icon: Calendar,
      current: location.pathname === "/settings/schedule",
    },
    {
      name: "Base de données",
      href: "/settings/database",
      icon: Database,
      current: location.pathname === "/settings/database",
    },
  ];

  // Special routes for user management
  const userManagementNavigation = [
    {
      name: "Gestion des utilisateurs",
      href: "/settings/users",
      icon: UserCog,
      current: location.pathname === "/settings/users" || 
              location.pathname === "/settings/add-user" || 
              location.pathname.includes("/settings/edit-user/"),
    },
  ];

  // Additional routes for admins
  const adminOnlyNavigation = [
    {
      name: "Chargé(e)s d'affaires",
      href: "/settings/freelancers",
      icon: UserPlus,
      current: location.pathname === "/settings/freelancers",
    },
  ];

  // Super admin exclusive routes
  const superAdminNavigation = [
    {
      name: "Administration",
      href: "/settings/admin",
      icon: Shield,
      current: location.pathname === "/settings/admin",
    },
  ];

  // Construct navigation based on user role
  let navigation = [...baseNavigation];

  if (isAdminOrSuperAdmin) {
    navigation = [...navigation, ...adminNavigation, ...userManagementNavigation];
  }

  if (isAdmin) {
    navigation = [...navigation, ...adminOnlyNavigation];
  }

  if (isSuperAdmin) {
    navigation = [...navigation, ...superAdminNavigation];
  }

  return (
    <aside className="hidden md:block w-64 border-r h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex flex-col h-full">
        {/* User selector is only visible for admins and super admins */}
        {isAdminOrSuperAdmin && (
          <div className="px-4 py-4 border-b">
            <UserSelector
              selectedUserId={selectedUserId}
              onSelectUser={onSelectUser}
              currentUser={currentUserId}
            />
          </div>
        )}
        
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  item.current
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    item.current
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default SettingsSidebar;
