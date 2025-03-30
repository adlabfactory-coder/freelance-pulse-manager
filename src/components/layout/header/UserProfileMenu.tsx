
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { BookOpen, HelpCircle, LogOut, Settings, User, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types/roles';

const UserProfileMenu: React.FC = () => {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  
  const handleLogout = async () => {
    console.log("Bouton de déconnexion UserProfileMenu cliqué");
    try {
      await logout();
      // Le processus complet de déconnexion est géré par le hook useLogout
    } catch (err) {
      console.error("Erreur lors de la déconnexion depuis UserProfileMenu:", err);
    }
  };

  const handleExternalNavigation = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getRoleBadgeStyle = () => {
    switch(role) {
      case UserRole.SUPER_ADMIN:
        return "bg-red-500 hover:bg-red-600";
      case UserRole.ADMIN:
        return "bg-purple-500 hover:bg-purple-600";
      case UserRole.ACCOUNT_MANAGER:
        return "bg-blue-500 hover:bg-blue-600";
      case UserRole.FREELANCER:
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getRoleName = () => {
    switch(role) {
      case UserRole.SUPER_ADMIN:
        return "Super Admin";
      case UserRole.ADMIN:
        return "Administrateur";
      case UserRole.ACCOUNT_MANAGER:
        return "Chargé d'affaires";
      case UserRole.FREELANCER:
        return "Freelance";
      default:
        return "Utilisateur";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-semibold">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
            <div className="mt-1">
              <Badge className={`${getRoleBadgeStyle()} flex items-center gap-1 text-xs py-0 px-2`}>
                <UserCheck className="h-3 w-3" /> 
                {getRoleName()}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Mon profil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExternalNavigation('/docs')}>
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Documentation</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExternalNavigation('/support')}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
