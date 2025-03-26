
import React from "react";
import {
  BarChart,
  Calendar,
  FileText,
  Home,
  Settings,
  Users,
  FileSpreadsheet,
  PieChart
} from "lucide-react";
import { NavItem as NavItemType } from "@/types";
import NavItem from "./NavItem";
import { useAuth } from "@/hooks/use-auth";

interface NavigationProps {
  collapsed: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ collapsed }) => {
  const { isAdmin, isFreelancer, isAccountManager, role } = useAuth();
  
  const allNavItems: NavItemType[] = [
    { title: "Tableau de bord", href: "/dashboard", icon: Home },
    { title: "Contacts", href: "/contacts", icon: Users },
    { title: "Rendez-vous", href: "/appointments", icon: Calendar },
    { title: "Devis", href: "/quotes", icon: FileText },
    { title: "Abonnements", href: "/subscriptions", icon: FileSpreadsheet },
    { title: "Commissions", href: "/commissions", icon: BarChart },
    { title: "Rapports", href: "/reports", icon: PieChart },
    { title: "Paramètres", href: "/settings", icon: Settings },
  ];
  
  // Déterminer les éléments à afficher en fonction du rôle
  let visibleItems = allNavItems;
  
  if (isFreelancer) {
    // Pour les freelancers, tous ces éléments doivent être visibles
    const freelancerItems = [
      "/dashboard",
      "/contacts",
      "/appointments", 
      "/quotes",
      "/commissions",
      "/settings"
    ];
    
    visibleItems = allNavItems.filter(item => freelancerItems.includes(item.href));
  } else if (isAccountManager) {
    const accountManagerItems = [
      "/dashboard",
      "/contacts",
      "/appointments",
      "/quotes",
      "/settings"
    ];
    
    visibleItems = allNavItems.filter(item => accountManagerItems.includes(item.href));
  } else if (!isAdmin) {
    // Accès de base pour les autres rôles
    visibleItems = allNavItems.filter(item => ["/dashboard", "/settings"].includes(item.href));
  }
  
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
