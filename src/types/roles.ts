
// User roles
export enum UserRole {
  FREELANCER = "freelancer",
  ACCOUNT_MANAGER = "account_manager",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin"
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

// New exported types and constants needed by components
export enum PermissionCategory {
  USER = "Utilisateurs",
  CONTACT = "Contacts",
  QUOTE = "Devis",
  SUBSCRIPTION = "Abonnements",
  BILLING = "Facturation",
  COMMISSION = "Commissions",
  REPORT = "Rapports",
  SYSTEM = "Système"
}

export interface RolePermission {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
  roles: UserRole[];
}

// Default permission set used in the admin panel
export const DEFAULT_PERMISSIONS: RolePermission[] = [
  {
    id: "view-users",
    name: "Voir les utilisateurs",
    description: "Permet de voir la liste des utilisateurs",
    category: PermissionCategory.USER,
    roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
  },
  {
    id: "create-users",
    name: "Créer des utilisateurs",
    description: "Permet de créer de nouveaux utilisateurs",
    category: PermissionCategory.USER,
    roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
  },
  {
    id: "update-users",
    name: "Modifier des utilisateurs",
    description: "Permet de modifier les informations des utilisateurs",
    category: PermissionCategory.USER,
    roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
  },
  {
    id: "delete-users",
    name: "Supprimer des utilisateurs",
    description: "Permet de supprimer des utilisateurs",
    category: PermissionCategory.USER,
    roles: [UserRole.SUPER_ADMIN]
  },
  {
    id: "manage-quotes",
    name: "Gérer les devis",
    description: "Permet de créer, modifier et supprimer des devis",
    category: PermissionCategory.QUOTE,
    roles: [UserRole.FREELANCER, UserRole.ACCOUNT_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN]
  },
  {
    id: "view-commissions",
    name: "Voir les commissions",
    description: "Permet de voir ses propres commissions",
    category: PermissionCategory.COMMISSION,
    roles: [UserRole.FREELANCER, UserRole.ACCOUNT_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN]
  },
  {
    id: "manage-commissions",
    name: "Gérer toutes les commissions",
    description: "Permet de gérer les commissions de tous les utilisateurs",
    category: PermissionCategory.COMMISSION,
    roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
  }
];

// Role hierarchy for permission checks
export const ROLE_HIERARCHY = [
  UserRole.FREELANCER,
  UserRole.ACCOUNT_MANAGER,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN
];

// French labels for user roles
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.FREELANCER]: "Freelance",
  [UserRole.ACCOUNT_MANAGER]: "Chargé de compte",
  [UserRole.ADMIN]: "Administrateur",
  [UserRole.SUPER_ADMIN]: "Super Administrateur"
};

// Helper function to check if a user has at least the specified role in the hierarchy
export function hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const minimumRoleIndex = ROLE_HIERARCHY.indexOf(minimumRole);
  
  if (userRoleIndex === -1 || minimumRoleIndex === -1) {
    return false;
  }
  
  return userRoleIndex >= minimumRoleIndex;
}
