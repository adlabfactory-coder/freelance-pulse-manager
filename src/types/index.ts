
// Re-export des types depuis les fichiers spécialisés
export { UserRole } from './roles';
export type { User } from './user';
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
