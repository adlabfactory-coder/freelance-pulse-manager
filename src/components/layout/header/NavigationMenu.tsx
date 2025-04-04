
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
import { getNavigationConfig } from '@/config/navigation';

const NavigationMenu: React.FC = () => {
  const { isAdminOrSuperAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  // Utiliser la configuration de navigation centralisée
  const visibleItems = getNavigationConfig(isAdminOrSuperAdmin, isSuperAdmin);

  const handleNavigation = (href: string) => {
    // Assurer que toutes les routes commencent par /
    const normalizedPath = href.startsWith('/') ? href : `/${href}`;
    navigate(normalizedPath);
    setNavMenuOpen(false);
  };

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
          {visibleItems.map((item) => (
            <DropdownMenuItem key={item.href} onClick={() => handleNavigation(item.href)}>
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
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
            {visibleItems.map((item) => (
              <Button 
                key={item.href} 
                variant="ghost" 
                className="justify-start" 
                onClick={() => handleNavigation(item.href)}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
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
