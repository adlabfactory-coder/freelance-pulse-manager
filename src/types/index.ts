
// Use export type for re-exporting types to solve the isolatedModules issue
import { ContactStatus } from './database/enums';
export type { ContactStatus };

export * from './database';
export * from './database/enums';
export * from './user';
export * from './contact';
export * from './quote';
export * from './appointment';

// Export subscription types from subscription.ts
export * from './subscription';

// Création et exportation des types manquants
export enum UserRole {
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  FREELANCER = "freelancer",
  ACCOUNT_MANAGER = "account_manager",
  CLIENT = "client"
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType; // Modifié pour accepter des éléments React (icônes)
  roles?: UserRole[];
  isActive?: boolean;
  disabled?: boolean; // Ajout de la propriété manquante
}

export interface SearchOptions {
  query?: string;
  filters?: Record<string, any>;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Interface pour les éléments de la sidebar
export interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType; // Modifié pour accepter des éléments React (icônes)
  roles?: UserRole[];
}
