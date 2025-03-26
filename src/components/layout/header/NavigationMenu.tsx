
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

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const NavigationMenu: React.FC = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [navMenuOpen, setNavMenuOpen] = useState(false);

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
    
    if (role === 'freelancer') {
      const freelancerItems = [
        "/dashboard", "/contacts", "/appointments", "/quotes", "/commissions", "/settings"
      ];
      return allNavItems.filter(item => freelancerItems.includes(item.href));
    } else if (role === 'account_manager') {
      const accountManagerItems = [
        "/dashboard", "/contacts", "/appointments", "/quotes", "/commissions", "/settings"
      ];
      return allNavItems.filter(item => accountManagerItems.includes(item.href));
    } else if (role !== 'admin') {
      return allNavItems.filter(item => ["/dashboard", "/settings"].includes(item.href));
    }
    
    return allNavItems;
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
            <DropdownMenuItem key={item.href} onClick={() => navigate(item.href)}>
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
                onClick={() => {
                  navigate(item.href);
                  setNavMenuOpen(false);
                }}
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
