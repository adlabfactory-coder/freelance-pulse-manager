
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
  Shield,
  Layers
} from "lucide-react";
import { NavItem as NavItemType } from "@/types";
import NavItem from "./NavItem";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/roles";

interface NavigationProps {
  collapsed: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ collapsed }) => {
  const { role, isAdminOrSuperAdmin, isSuperAdmin } = useAuth();
  
  // Définition de tous les éléments de navigation possibles
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
  
  // Éléments spécifiques pour les Super Admins
  if (isSuperAdmin) {
    allNavItems.push(
      { title: "Administration", href: "/admin", icon: Shield },
      { title: "Audit", href: "/audit", icon: Layers }
    );
  }
  
  // Configuration des accès par rôle
  const roleAccess: Record<UserRole, string[]> = {
    [UserRole.SUPER_ADMIN]: allNavItems.map(item => item.href), // Accès complet
    [UserRole.ADMIN]: [
      "/dashboard", 
      "/contacts", 
      "/appointments", 
      "/quotes", 
      "/subscriptions", 
      "/commissions", 
      "/reports", 
      "/settings"
    ],
    [UserRole.FREELANCER]: [
      "/dashboard",
      "/contacts",
      "/appointments", 
      "/quotes",
      "/commissions",
      "/settings"
    ],
    [UserRole.ACCOUNT_MANAGER]: [
      "/dashboard",
      "/contacts",
      "/appointments",
      "/quotes",
      "/settings"
    ],
    [UserRole.CLIENT]: [
      "/dashboard", 
      "/settings"
    ]
  };
  
  // Déterminer les éléments de navigation visibles en fonction du rôle
  let visibleItems: NavItemType[] = [];
  
  if (role) {
    const allowedPaths = roleAccess[role] || ["/dashboard", "/settings"];
    visibleItems = allNavItems.filter(item => allowedPaths.includes(item.href));
  } else {
    // Fallback - accès minimum
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
