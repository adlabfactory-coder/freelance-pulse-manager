
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
  const { isAdmin, isFreelancer, isAccountManager } = useAuth();
  
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
  
  // Filtrage des éléments de navigation en fonction du rôle
  const navItems = allNavItems.filter(item => {
    // Les admins ont accès à tout
    if (isAdmin) return true;
    
    // Les freelancers ont accès aux contacts, rendez-vous et devis
    if (isFreelancer) {
      return [
        "/dashboard",
        "/contacts",
        "/appointments",
        "/quotes",
      ].includes(item.href);
    }
    
    // Les chargés d'affaires ont accès aux devis à valider, rendez-vous et commissions
    if (isAccountManager) {
      return [
        "/dashboard",
        "/appointments",
        "/quotes",
        "/commissions",
      ].includes(item.href);
    }
    
    // Par défaut, accès restreint
    return ["/dashboard", "/settings"].includes(item.href);
  });

  const renderIcon = (Icon: React.ElementType) => {
    return <Icon className="h-5 w-5" aria-hidden="true" />;
  };

  return (
    <nav className="space-y-1 px-2">
      {navItems.map((item) => (
        <NavItem 
          key={item.href} 
          item={item} 
          collapsed={collapsed} 
          renderIcon={renderIcon} 
        />
      ))}
    </nav>
  );
};

export default Navigation;
