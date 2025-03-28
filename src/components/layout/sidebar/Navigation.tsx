
import React from "react";
import { NavItem } from "@/types/navigation";
import NavItemComponent from "./NavItem";
import { useAuth } from "@/hooks/use-auth";
import { getNavigationConfig } from "@/config/navigation";

interface NavigationProps {
  collapsed: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ collapsed }) => {
  const { isAdminOrSuperAdmin, isSuperAdmin } = useAuth();
  
  // Obtenir la configuration de navigation centralisée
  const visibleItems = getNavigationConfig(isAdminOrSuperAdmin, isSuperAdmin);
  
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
