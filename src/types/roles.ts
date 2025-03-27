
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  ACCOUNT_MANAGER = "account_manager",
  FREELANCER = "freelancer"
}

export const roleLabels: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "Super Admin",
  [UserRole.ADMIN]: "Admin",
  [UserRole.ACCOUNT_MANAGER]: "Account Manager",
  [UserRole.FREELANCER]: "Freelancer"
};

// Add missing exports for the role-related components
export const USER_ROLE_LABELS = roleLabels;

// Super admin is at index 0, giving them highest priority
export const ROLE_HIERARCHY = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.ACCOUNT_MANAGER,
  UserRole.FREELANCER
];

export enum PermissionCategory {
  USERS = "users",
  CONTACTS = "contacts",
  QUOTES = "quotes",
  APPOINTMENTS = "appointments",
  SERVICES = "services",
  SUBSCRIPTIONS = "subscriptions",
  COMMISSIONS = "commissions",
  SETTINGS = "settings",
  SYSTEM = "system"
}

export interface RolePermission {
  id?: string;
  name?: string;
  description?: string;
  role?: UserRole;
  category: PermissionCategory;
  roles?: UserRole[];
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
  approve?: boolean;
}

export const DEFAULT_PERMISSIONS: RolePermission[] = [
  // Super Admin has all permissions across all categories
  {
    role: UserRole.SUPER_ADMIN,
    category: PermissionCategory.USERS,
    create: true,
    read: true,
    update: true,
    delete: true,
    approve: true
  },
  // Add more default permissions...
];

// Helper function to check if a user has at least the specified role
export const hasMinimumRole = (userRole: UserRole | undefined, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  // Lower index means higher role (SUPER_ADMIN is index 0)
  return userRoleIndex <= requiredRoleIndex;
};
