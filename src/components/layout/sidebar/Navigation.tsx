
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
import { NavItem as NavItemType } from "@/types";
import { UserRole } from "@/types";
import NavItem from "./NavItem";
import { useAuth } from "@/hooks/use-auth";

interface NavigationProps {
  collapsed: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ collapsed }) => {
  const { user, role, isAdminOrSuperAdmin, isSuperAdmin } = useAuth();
  
  // Définition de tous les éléments de navigation possibles
  const allNavItems: NavItemType[] = [
    { title: "Tableau de bord", href: "/dashboard", icon: Home },
    { title: "Contacts", href: "/contacts", icon: Users },
    { title: "Rendez-vous", href: "/appointments", icon: Calendar },
    { title: "Devis", href: "/quotes", icon: FileText },
  ];
  
  // Éléments réservés aux administrateurs et super administrateurs
  const adminNavItems: NavItemType[] = [
    { title: "Abonnements", href: "/subscriptions", icon: FileSpreadsheet },
    { title: "Rapports", href: "/reports", icon: PieChart },
  ];
  
  // Commissions disponibles pour tous
  const commonNavItems: NavItemType[] = [
    { title: "Commissions", href: "/commissions", icon: BarChart },
  ];
  
  // Paramètres disponibles pour tous, mais avec contenu différent selon le rôle
  const settingsNavItem: NavItemType = { title: "Paramètres", href: "/settings", icon: Settings };
  
  // Construire la navigation en fonction du rôle
  let visibleItems = [...allNavItems, ...commonNavItems];
  
  // Ajouter les éléments admin si l'utilisateur est admin ou super admin
  if (isAdminOrSuperAdmin) {
    visibleItems = [...visibleItems, ...adminNavItems];
  }
  
  // Ajouter l'item paramètres pour tous
  visibleItems = [...visibleItems, settingsNavItem];
  
  // Filtrer les doublons (par exemple si "Administration" est ajouté deux fois)
  visibleItems = visibleItems.filter((item, index, self) => 
    index === self.findIndex((t) => t.href === item.href)
  );
  
  return (
    <nav className="space-y-1 px-2">
      {visibleItems.map((item) => (
        <NavItem 
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
