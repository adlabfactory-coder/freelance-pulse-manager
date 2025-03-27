
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  ACCOUNT_MANAGER = "account_manager",
  FREELANCER = "freelancer",
  CLIENT = "client"
}

export const roleLabels: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "Super Admin",
  [UserRole.ADMIN]: "Admin",
  [UserRole.ACCOUNT_MANAGER]: "Account Manager",
  [UserRole.FREELANCER]: "Freelancer",
  [UserRole.CLIENT]: "Client"
};
