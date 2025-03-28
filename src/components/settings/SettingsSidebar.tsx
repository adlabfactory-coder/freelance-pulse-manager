
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  User,
  Bell,
  ShieldAlert,
  Users,
  Building,
  Briefcase,
  BarChart4,
  ShieldCheck,
  ScrollText
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { User as UserType } from "@/types";

interface SettingsSidebarProps {
  currentUser: UserType | null;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

interface SidebarLink {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  requiresAdmin?: boolean;
  requiresSuperAdmin?: boolean;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ 
  currentUser, 
  isAdmin = false, 
  isSuperAdmin = false
}) => {
  const location = useLocation();
  const { isAdminOrSuperAdmin } = useAuth();
  
  // Tableau des liens de navigation pour les paramètres
  const sidebarLinks: SidebarLink[] = [
    { href: "/settings/profile", icon: User, label: "Profil" },
    { href: "/settings/notifications", icon: Bell, label: "Notifications" },
    { href: "/settings/security", icon: ShieldAlert, label: "Sécurité" },
    // Liens administratifs
    { href: "/settings/agency", icon: Building, label: "Agence", requiresAdmin: true },
    { href: "/settings/account-managers", icon: Briefcase, label: "Chargés d'affaires", requiresAdmin: true },
    { href: "/settings/freelancers", icon: BarChart4, label: "Freelancers", requiresAdmin: true },
    // Liens super administrateur
    { href: "/settings/admin", icon: ShieldCheck, label: "Administration", requiresSuperAdmin: true },
    { href: "/settings/audit", icon: ScrollText, label: "Audit", requiresSuperAdmin: true },
  ];

  const filteredLinks = sidebarLinks.filter(link => {
    if (link.requiresSuperAdmin && !isSuperAdmin) return false;
    if (link.requiresAdmin && !isAdminOrSuperAdmin) return false;
    return true;
  });

  return (
    <div className="w-full md:w-64 bg-card border rounded-lg shrink-0">
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="py-6 space-y-1">
          {filteredLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 mx-2 rounded-md text-sm transition-colors",
                isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                location.pathname === link.href ? "bg-accent text-accent-foreground" : ""
              )}
            >
              {React.createElement(link.icon, { className: "h-4 w-4" })}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SettingsSidebar;
