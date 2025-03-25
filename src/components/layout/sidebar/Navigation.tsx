
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

interface NavigationProps {
  collapsed: boolean;
}

const navItems: NavItemType[] = [
  { title: "Tableau de bord", href: "/", icon: Home },
  { title: "Contacts", href: "/contacts", icon: Users },
  { title: "Rendez-vous", href: "/appointments", icon: Calendar },
  { title: "Devis", href: "/quotes", icon: FileText },
  { title: "Abonnements", href: "/subscriptions", icon: FileSpreadsheet },
  { title: "Commissions", href: "/commissions", icon: BarChart },
  { title: "Rapports", href: "/reports", icon: PieChart },
  { title: "Paramètres", href: "/settings", icon: Settings },
];

const Navigation: React.FC<NavigationProps> = ({ collapsed }) => {
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
