
import React from "react";
import {
  BarChart,
  Calendar,
  FileText,
  Home,
  Settings,
  Users,
  FileSpreadsheet,
  PieChart,
} from "lucide-react";
import { NavItem } from "@/types/navigation";
import NavItem as NavItemComponent from "./NavItem";
import { useAuth } from "@/hooks/use-auth";

interface NavigationProps {
  collapsed: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ collapsed }) => {
  const { isAdminOrSuperAdmin } = useAuth();
  
  // Définition de tous les éléments de navigation possibles
  const navItems: NavItem[] = [
    { title: "Tableau de bord", href: "/dashboard", icon: Home },
    { title: "Contacts", href: "/contacts", icon: Users },
    { title: "Rendez-vous", href: "/appointments", icon: Calendar },
    { title: "Devis", href: "/quotes", icon: FileText },
    { title: "Commissions", href: "/commissions", icon: BarChart },
  ];
  
  // Éléments réservés aux administrateurs et super administrateurs
  const adminNavItems: NavItem[] = [
    { title: "Abonnements", href: "/subscriptions", icon: FileSpreadsheet },
    { title: "Rapports", href: "/reports", icon: PieChart },
  ];
  
  // Paramètres disponibles pour tous
  const settingsNavItem: NavItem = { title: "Paramètres", href: "/settings", icon: Settings };
  
  // Construire la navigation en fonction du rôle
  let visibleItems = [...navItems];
  
  // Ajouter les éléments admin si l'utilisateur est admin ou super admin
  if (isAdminOrSuperAdmin) {
    visibleItems = [...visibleItems, ...adminNavItems];
  }
  
  // Ajouter l'item paramètres pour tous
  visibleItems = [...visibleItems, settingsNavItem];
  
  return (
    <nav className="space-y-1 px-2">
      {visibleItems.map((item) => (
        <NavItemComponent 
          key={item.href} 
          item={item} 
          collapsed={collapsed} 
          renderIcon={(Icon) => <Icon className="h-5 w-5" aria-hidden="true" />} 
        />
      ))}
    </nav>
  );
};

export default Navigation;
