
import React from "react";
import { useLocation } from "react-router-dom";
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
  
  // Pas de filtrage pour les administrateurs
  if (isAdmin) {
    return (
      <nav className="space-y-1 px-2">
        {allNavItems.map((item) => (
          <NavItem 
            key={item.href} 
            item={item} 
            collapsed={collapsed} 
            renderIcon={(Icon) => <Icon className="h-5 w-5" aria-hidden="true" />} 
          />
        ))}
      </nav>
    );
  }
  
  // Filtrage pour les freelancers
  if (isFreelancer) {
    const freelancerItems = [
      "/dashboard",
      "/contacts",
      "/appointments",
      "/quotes",
      "/commissions",
      "/settings"
    ];
    
    return (
      <nav className="space-y-1 px-2">
        {allNavItems
          .filter(item => freelancerItems.includes(item.href))
          .map((item) => (
            <NavItem 
              key={item.href} 
              item={item} 
              collapsed={collapsed} 
              renderIcon={(Icon) => <Icon className="h-5 w-5" aria-hidden="true" />} 
            />
          ))}
      </nav>
    );
  }
  
  // Filtrage pour les chargés d'affaires
  if (isAccountManager) {
    const accountManagerItems = [
      "/dashboard",
      "/appointments",
      "/quotes",
      "/commissions",
      "/settings"
    ];
    
    return (
      <nav className="space-y-1 px-2">
        {allNavItems
          .filter(item => accountManagerItems.includes(item.href))
          .map((item) => (
            <NavItem 
              key={item.href} 
              item={item} 
              collapsed={collapsed} 
              renderIcon={(Icon) => <Icon className="h-5 w-5" aria-hidden="true" />} 
            />
          ))}
      </nav>
    );
  }
  
  // Accès de base pour les autres rôles (minimum dashboard et settings)
  return (
    <nav className="space-y-1 px-2">
      {allNavItems
        .filter(item => ["/dashboard", "/settings"].includes(item.href))
        .map((item) => (
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
