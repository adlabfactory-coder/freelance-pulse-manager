
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

/**
 * Configuration centralisée pour la navigation
 * Utilisée par la sidebar et le menu de navigation déroulant
 */
export const getNavigationConfig = (isAdminOrSuperAdmin: boolean, isSuperAdmin: boolean): NavItem[] => {
  // Éléments de base accessibles à tous les utilisateurs
  const navItems: NavItem[] = [
    { title: "Tableau de bord", href: "/dashboard", icon: Home },
    { title: "Contacts", href: "/contacts", icon: Users },
    { title: "Rendez-vous", href: "/appointments", icon: Calendar },
    { title: "Devis", href: "/quotes", icon: FileText },
    { title: "Commissions", href: "/commissions", icon: BarChart },
  ];
  
  // Éléments réservés aux administrateurs et super administrateurs
  if (isAdminOrSuperAdmin) {
    navItems.push(
      { title: "Abonnements", href: "/subscriptions", icon: FileSpreadsheet },
      { title: "Rapports", href: "/reports", icon: PieChart }
    );
  }
  
  // Paramètres disponibles pour tous
  navItems.push({ title: "Paramètres", href: "/settings", icon: Settings });
  
  return navItems;
};
