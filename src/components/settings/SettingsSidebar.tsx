
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  UserCircle, 
  Shield, 
  Database, 
  Users, 
  Briefcase,
  BarChart3,
  Key,
  DollarSign,
  UserCog
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types";

interface SettingsLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  end?: boolean;
}

interface SettingsSidebarProps {
  currentUser: User;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const SettingsLink: React.FC<SettingsLinkProps> = ({ to, label, icon, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )
    }
  >
    {icon}
    {label}
  </NavLink>
);

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ currentUser, isAdmin, isSuperAdmin }) => {
  const { isAdminOrSuperAdmin } = useAuth();
  
  return (
    <aside className="w-64 hidden md:block">
      <nav className="space-y-1">
        <SettingsLink
          to="/settings"
          label="Profil utilisateur"
          icon={<UserCircle className="h-5 w-5" />}
          end
        />

        <SettingsLink
          to="/settings/security"
          label="Sécurité"
          icon={<Shield className="h-5 w-5" />}
        />
        
        <SettingsLink
          to="/settings/api-keys"
          label="Clés API"
          icon={<Key className="h-5 w-5" />}
        />
        
        {isAdminOrSuperAdmin && (
          <>
            <div className="my-3 h-px bg-border" />
            
            <SettingsLink
              to="/settings/users"
              label="Utilisateurs"
              icon={<Users className="h-5 w-5" />}
            />
            
            <SettingsLink
              to="/settings/roles"
              label="Rôles & Permissions"
              icon={<UserCog className="h-5 w-5" />}
            />
            
            <SettingsLink
              to="/settings/freelancers"
              label="Freelances"
              icon={<Briefcase className="h-5 w-5" />}
            />
            
            <SettingsLink
              to="/settings/services"
              label="Services"
              icon={<BarChart3 className="h-5 w-5" />}
            />
            
            <SettingsLink
              to="/settings/commissions"
              label="Commissions"
              icon={<DollarSign className="h-5 w-5" />}
            />
          </>
        )}
        
        {isSuperAdmin && (
          <>
            <div className="my-3 h-px bg-border" />
            
            <SettingsLink
              to="/settings/database"
              label="Base de données"
              icon={<Database className="h-5 w-5" />}
            />
          </>
        )}
      </nav>
    </aside>
  );
};

export default SettingsSidebar;
