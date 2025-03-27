
// Types d'utilisateur
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  FREELANCER = 'freelancer',
  ACCOUNT_MANAGER = 'account_manager',
  CLIENT = 'client'
}

// Interface utilisateur
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  avatar?: string | null;
  supervisor_id?: string | null;
  calendly_url?: string;
  calendly_enabled?: boolean;
  calendly_sync_email?: string;
}

// Re-export des types depuis les fichiers spécialisés
export { 
  type Quote, 
  type QuoteItem, 
  QuoteStatus, 
  getQuoteStatusLabel, 
  getQuoteStatusColor 
} from './quote';

export { 
  type Subscription, 
  type SubscriptionPlan,
  SubscriptionStatus,
  SubscriptionInterval
} from './subscription';

// Interface élément de navigation
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ElementType;
  submenu?: NavItem[];
  permission?: string[];
  disabled?: boolean;
}

// Export du type Contact
export type { Contact } from './contact';
