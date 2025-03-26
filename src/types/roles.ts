
import { UserRole } from './index';

// Export UserRole for direct imports from this file
export { UserRole };

// Définition des étiquettes des rôles pour l'affichage
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  'super_admin': 'Super Admin',
  'admin': 'Administrateur',
  'account_manager': 'Chargé(e) de compte',
  'freelancer': 'Chargé(e) d\'affaires'
};

// Catégories de permissions pour l'organisation dans l'interface
export enum PermissionCategory {
  USERS = "Utilisateurs",
  CONTACTS = "Contacts",
  APPOINTMENTS = "Rendez-vous",
  QUOTES = "Devis",
  SUBSCRIPTIONS = "Abonnements",
  COMMISSIONS = "Commissions",
  REPORTS = "Rapports",
  SETTINGS = "Paramètres",
  SYSTEM = "Système"
}

// Structure d'une permission
export interface RolePermission {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
  roles: UserRole[];
}

// Vérifie si le rôle de l'utilisateur est au moins du niveau requis
export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roles = [
    UserRole.FREELANCER,
    UserRole.ACCOUNT_MANAGER,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN
  ];
  
  const userRoleIndex = roles.indexOf(userRole);
  const requiredRoleIndex = roles.indexOf(requiredRole);
  
  return userRoleIndex >= requiredRoleIndex;
}

// Les permissions seront gérées dynamiquement par les administrateurs
// Cette structure vide sera utilisée comme point de départ
export const DEFAULT_PERMISSIONS: RolePermission[] = [];
