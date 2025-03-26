
import { UserRole } from './index';

// Définition des étiquettes des rôles pour l'affichage
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  'super_admin': 'Super Admin',
  'admin': 'Administrateur',
  'freelancer': 'Chargé(e) d\'affaires',
  'account_manager': 'Chargé(e) de compte',
  'client': 'Client'
};

// Hiérarchie des rôles (du plus élevé au plus bas)
export const ROLE_HIERARCHY: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.ACCOUNT_MANAGER,
  UserRole.FREELANCER,
  UserRole.CLIENT
];

// Interface pour les permissions par rôle
export interface RolePermission {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
}

// Permissions par défaut
export const DEFAULT_PERMISSIONS: RolePermission[] = [
  {
    id: "manage_users",
    name: "Gestion des utilisateurs",
    description: "Créer, modifier et supprimer des utilisateurs",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "manage_roles",
    name: "Gestion des rôles",
    description: "Définir les permissions pour chaque rôle",
    roles: [UserRole.SUPER_ADMIN]
  },
  {
    id: "manage_freelancers",
    name: "Gestion des freelances",
    description: "Ajouter et gérer des freelances",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "view_commissions",
    name: "Voir les commissions",
    description: "Consulter toutes les commissions",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER]
  },
  {
    id: "manage_commissions",
    name: "Gérer les commissions",
    description: "Approuver et modifier les commissions",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "manage_services",
    name: "Gérer les services",
    description: "Ajouter, modifier et supprimer des services",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "database_access",
    name: "Accès base de données",
    description: "Accéder aux fonctionnalités avancées de la base de données",
    roles: [UserRole.SUPER_ADMIN]
  },
  {
    id: "manage_api_keys",
    name: "Gérer les clés API",
    description: "Créer et révoquer des clés API",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  }
];
