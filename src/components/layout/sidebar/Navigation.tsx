
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
  Layers,
  UserPlus
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
  } else if (role === UserRole.ADMIN) {
    allNavItems.push(
      { title: "Administration", href: "/admin", icon: Shield }
    );
  }
  
  // Ajout de l'élément de gestion des utilisateurs pour les admins et super admins
  if (isAdminOrSuperAdmin) {
    allNavItems.push(
      { title: "Gestion utilisateurs", href: "/admin/users", icon: UserPlus }
    );
  }
  
  // La navigation est désormais contrôlée par le rôle de l'utilisateur
  let visibleItems: NavItemType[] = [];
  
  // Super Admin a accès à TOUT sans restrictions
  if (isSuperAdmin) {
    visibleItems = allNavItems;
  } 
  // Accès complet pour admins ordinaires
  else if (role === UserRole.ADMIN) {
    visibleItems = allNavItems.filter(item => 
      !["/audit"].includes(item.href)
    );
  } else if (role === UserRole.ACCOUNT_MANAGER) {
    // Accès pour les chargés de compte
    visibleItems = allNavItems.filter(item => 
      ["/dashboard", "/contacts", "/appointments", "/quotes", "/commissions", "/settings"].includes(item.href)
    );
  } else if (role === UserRole.FREELANCER) {
    // Accès pour les freelancers
    visibleItems = allNavItems.filter(item => 
      ["/dashboard", "/contacts", "/appointments", "/quotes", "/commissions", "/settings"].includes(item.href)
    );
  } else {
    // Accès minimum par défaut si rôle non défini
    visibleItems = allNavItems.filter(item => 
      ["/dashboard", "/contacts", "/settings"].includes(item.href)
    );
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
