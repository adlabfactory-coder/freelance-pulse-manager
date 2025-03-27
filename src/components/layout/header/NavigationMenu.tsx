
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { UserRole } from '@/types';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const NavigationMenu: React.FC = () => {
  const { user, role, isAdminOrSuperAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  const handleNavigation = (href: string) => {
    // Assurer que toutes les routes commencent par /
    const normalizedPath = href.startsWith('/') ? href : `/${href}`;
    navigate(normalizedPath);
    setNavMenuOpen(false);
  };

  // Navigation items based on role
  const getNavItems = (): NavItem[] => {
    const allNavItems: NavItem[] = [
      { title: "Tableau de bord", href: "/dashboard", icon: Icons.Home },
      { title: "Contacts", href: "/contacts", icon: Icons.Users },
      { title: "Rendez-vous", href: "/appointments", icon: Icons.Calendar },
      { title: "Devis", href: "/quotes", icon: Icons.FileText },
      { title: "Abonnements", href: "/subscriptions", icon: Icons.FileSpreadsheet },
      { title: "Commissions", href: "/commissions", icon: Icons.BarChart },
      { title: "Rapports", href: "/reports", icon: Icons.PieChart },
      { title: "Paramètres", href: "/settings", icon: Icons.Settings },
    ];
    
    // Super Admin specific items
    if (isSuperAdmin) {
      allNavItems.push(
        { title: "Administration", href: "/admin", icon: Icons.Shield },
        { title: "Audit", href: "/audit", icon: Icons.Layers }
      );
    }
    
    // Super Admin has access to everything
    if (isSuperAdmin) {
      return allNavItems;
    } 
    // Regular admin access
    else if (role === UserRole.ADMIN) {
      return allNavItems.filter(item => 
        !["/admin", "/audit"].includes(item.href)
      );
    } else if (role === UserRole.ACCOUNT_MANAGER) {
      // Accès pour les chargés de compte
      return allNavItems.filter(item => 
        ["/dashboard", "/contacts", "/appointments", "/quotes", "/commissions", "/settings"].includes(item.href)
      );
    } else if (role === UserRole.FREELANCER) {
      // Accès pour les freelancers
      return allNavItems.filter(item => 
        ["/dashboard", "/contacts", "/appointments", "/quotes", "/commissions", "/settings"].includes(item.href)
      );
    } else {
      // Accès minimum par défaut si rôle non défini
      return allNavItems.filter(item => 
        ["/dashboard", "/contacts", "/settings"].includes(item.href)
      );
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Menu déroulant de navigation pour desktop */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-2 hidden md:flex">
            Navigation <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Menu de navigation</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {navItems.map((item) => (
            <DropdownMenuItem key={item.href} onClick={() => handleNavigation(item.href)}>
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Menu de navigation pour mobile */}
      <Popover open={navMenuOpen} onOpenChange={setNavMenuOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="ml-2 md:hidden">
            Navigation <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="grid gap-1">
            {navItems.map((item) => (
              <Button 
                key={item.href} 
                variant="ghost" 
                className="justify-start" 
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default NavigationMenu;
