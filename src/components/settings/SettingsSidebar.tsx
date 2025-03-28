
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  Building,
  Lock,
  Settings,
  User,
  UserPlus,
  Users,
  Briefcase
} from "lucide-react";
import { User as UserType } from "@/types";
import { UserRole } from "@/types/roles";

interface SettingsSidebarProps {
  currentUser: UserType | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  currentUser,
  isAdmin,
  isSuperAdmin,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      title: "Profil",
      icon: <User className="mr-2 h-4 w-4" />,
      href: "/settings/profile",
      show: true,
    },
    {
      title: "Notifications",
      icon: <Bell className="mr-2 h-4 w-4" />,
      href: "/settings/notifications",
      show: true,
    },
    {
      title: "Sécurité",
      icon: <Lock className="mr-2 h-4 w-4" />,
      href: "/settings/security",
      show: true,
    },
    {
      title: "Paramètres de l'entreprise",
      icon: <Building className="mr-2 h-4 w-4" />,
      href: "/settings",
      show: isAdmin || isSuperAdmin,
    },
    {
      title: "Paramètres de l'agence",
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      href: "/settings/agency",
      show: isAdmin || isSuperAdmin,
    },
    {
      title: "Gestion des freelancers",
      icon: <UserPlus className="mr-2 h-4 w-4" />,
      href: "/settings/freelancers",
      show: isAdmin || isSuperAdmin,
    },
    {
      title: "Gestion des chargés d'affaires",
      icon: <UserPlus className="mr-2 h-4 w-4" />,
      href: "/settings/account-managers",
      show: isAdmin || isSuperAdmin,
    },
    {
      title: "Gestion des utilisateurs",
      icon: <Users className="mr-2 h-4 w-4" />,
      href: "/settings/users",
      show: isAdmin || isSuperAdmin,
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.show);

  return (
    <Card className="min-w-52 w-full md:w-52">
      <CardHeader>
        <CardTitle className="text-xl">Paramètres</CardTitle>
        {currentUser && (
          <CardDescription>
            {currentUser.name} ({currentUser.role || "Sans rôle"})
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <nav className="flex flex-col space-y-1">
          {visibleMenuItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "justify-start rounded-none border-l-4",
                currentPath === item.href
                  ? "border-primary bg-muted"
                  : "border-transparent hover:border-primary/50"
              )}
              asChild
            >
              <Link to={item.href}>
                {item.icon}
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
      </CardContent>
      <CardFooter className="py-3 border-t">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to="/dashboard">
            <Settings className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsSidebar;
