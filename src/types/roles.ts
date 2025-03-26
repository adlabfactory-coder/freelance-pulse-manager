
/**
 * Énumération des rôles utilisateurs dans l'application
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  FREELANCER = 'freelancer',
  ACCOUNT_MANAGER = 'account_manager',
  CLIENT = 'client',
}

/**
 * Constantes pour la gestion des rôles
 */
export const USER_ROLE_LABELS = {
  [UserRole.SUPER_ADMIN]: 'Super Administrateur',
  [UserRole.ADMIN]: 'Administrateur',
  [UserRole.FREELANCER]: 'Freelance',
  [UserRole.ACCOUNT_MANAGER]: 'Chargé de compte',
  [UserRole.CLIENT]: 'Client',
};

/**
 * Hiérarchie des rôles (du plus élevé au moins élevé)
 */
export const ROLE_HIERARCHY = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.ACCOUNT_MANAGER,
  UserRole.FREELANCER,
  UserRole.CLIENT,
];

/**
 * Vérifier si un rôle est au moins aussi élevé qu'un autre
 */
export function hasMinimumRole(userRole: UserRole | string, requiredRole: UserRole | string): boolean {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole as UserRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole as UserRole);
  
  // Plus l'index est petit, plus le rôle est élevé
  return userRoleIndex !== -1 && requiredRoleIndex !== -1 && userRoleIndex <= requiredRoleIndex;
}
