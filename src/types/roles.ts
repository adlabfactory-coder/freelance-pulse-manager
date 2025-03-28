
// User roles
export enum UserRole {
  USER = "user",
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
