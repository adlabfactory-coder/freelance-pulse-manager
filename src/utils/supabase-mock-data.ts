import { User, UserRole } from "@/types";

// Fonction pour générer des utilisateurs fictifs pour les démonstrations
export const getMockUsers = (): User[] => [
  {
    id: '1',
    name: 'Admin Démo',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    calendly_url: 'https://calendly.com/admin-demo',
    calendly_enabled: true,
    calendly_sync_email: 'admin@example.com',
    avatar: null
  },
  {
    id: '2',
    name: 'Commercial Démo',
    email: 'freelancer@example.com',
    role: UserRole.FREELANCER,
    calendly_url: 'https://calendly.com/freelancer-demo',
    calendly_enabled: true,
    calendly_sync_email: 'freelancer@example.com',
    avatar: null
  },
  {
    id: '3',
    name: 'Client Démo',
    email: 'client@example.com',
    role: UserRole.CLIENT,
    calendly_url: 'https://calendly.com/client-demo',
    calendly_enabled: false,
    calendly_sync_email: 'client@example.com',
    avatar: null
  },
  {
    id: '4',
    name: 'Chargé de Compte Démo',
    email: 'accountmanager@example.com',
    role: UserRole.ACCOUNT_MANAGER,
    calendly_url: 'https://calendly.com/accountmanager-demo',
    calendly_enabled: true,
    calendly_sync_email: 'accountmanager@example.com',
    avatar: null
  },
  {
    id: '5',
    name: 'Super Admin Démo',
    email: 'superadmin@example.com',
    role: UserRole.SUPER_ADMIN,
    calendly_url: 'https://calendly.com/superadmin-demo',
    calendly_enabled: true,
    calendly_sync_email: 'superadmin@example.com',
    avatar: null
  }
];
