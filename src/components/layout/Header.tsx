
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoonIcon, 
  SunIcon, 
  User, 
  LogOut, 
  Menu, 
  MessageCircle,
  Home,
  Users,
  Calendar,
  FileText,
  FileSpreadsheet,
  BarChart,
  PieChart,
  Settings,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  isDarkMode, 
  toggleDarkMode, 
  toggleSidebar,
  sidebarCollapsed 
}) => {
  const { user, role, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/auth/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
      });
    }
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/+212663529031', '_blank');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getRoleName = () => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'freelancer':
        return 'Freelancer';
      case 'account_manager':
        return 'Chargé(e) d\'affaires';
      case 'client':
        return 'Client';
      default:
        return 'Utilisateur';
    }
  };

  // Navigation items based on role
  const getNavItems = () => {
    const allNavItems = [
      { title: "Tableau de bord", href: "/dashboard", icon: Home },
      { title: "Contacts", href: "/contacts", icon: Users },
      { title: "Rendez-vous", href: "/appointments", icon: Calendar },
      { title: "Devis", href: "/quotes", icon: FileText },
      { title: "Abonnements", href: "/subscriptions", icon: FileSpreadsheet },
      { title: "Commissions", href: "/commissions", icon: BarChart },
      { title: "Rapports", href: "/reports", icon: PieChart },
      { title: "Paramètres", href: "/settings", icon: Settings },
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
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 border-b bg-background shadow-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Afficher le menu" : "Masquer le menu"}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Menu déroulant de navigation */}
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
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleWhatsAppContact}
          aria-label="Contacter par WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt="Avatar utilisateur" />
                  <AvatarFallback>
                    {user.email ? getInitials(user.email.split('@')[0]) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{user.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {getRoleName()}
                </p>
              </div>
              <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Mon profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
