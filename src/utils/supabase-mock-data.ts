
import { User, UserRole } from '@/types';

// Utilisateurs de démonstration avec IDs UUID
export const MOCK_USERS: User[] = [
  {
    id: '7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc',
    name: 'Super Admin Démo',
    email: 'superadmin@example.com',
    role: UserRole.SUPER_ADMIN,
    avatar: null,
    calendly_enabled: true,
    calendly_url: 'https://calendly.com/superadmin-demo',
    calendly_sync_email: 'superadmin@example.com'
  },
  {
    id: '6a94bd3d-7f5c-49ae-b09e-e570cb01a978',
    name: 'Admin Démo',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    avatar: null,
    calendly_enabled: true,
    calendly_url: 'https://calendly.com/admin-demo',
    calendly_sync_email: 'admin@example.com'
  },
  {
    id: '487fb1af-4396-49d1-ba36-8711facbb03c',
    name: 'Commercial Démo',
    email: 'commercial@example.com',
    role: UserRole.FREELANCER,
    avatar: null,
    calendly_enabled: true,
    calendly_url: 'https://calendly.com/commercial-demo',
    calendly_sync_email: 'commercial@example.com'
  },
  {
    id: '3f8e3f1c-c6f9-4c04-a0b9-88d7f6d8e05c',
    name: 'Chargé de Compte Démo',
    email: 'account@example.com',
    role: UserRole.ACCOUNT_MANAGER,
    avatar: null,
    calendly_enabled: true,
    calendly_url: 'https://calendly.com/account-demo',
    calendly_sync_email: 'account@example.com'
  },
  {
    id: '2b6329d2-73e4-4f5e-b56e-c26cdf4b3dda',
    name: 'Client Démo',
    email: 'client@example.com',
    role: UserRole.CLIENT,
    avatar: null,
    calendly_enabled: false,
    calendly_url: '',
    calendly_sync_email: ''
  }
];

// Fonction pour récupérer tous les utilisateurs mockés
export const getMockUsers = (): User[] => {
  return MOCK_USERS;
};

// Fonction pour récupérer un utilisateur mocké par ID
export const getMockUserById = (userId: string): User | null => {
  // Gérer à la fois les anciens IDs numériques et les nouveaux UUIDs
  const user = MOCK_USERS.find(u => 
    u.id === userId || 
    (userId === "1" && u.role === UserRole.ADMIN) ||
    (userId === "2" && u.role === UserRole.FREELANCER) ||
    (userId === "3" && u.role === UserRole.CLIENT) ||
    (userId === "4" && u.role === UserRole.SUPER_ADMIN) ||
    (userId === "5" && u.role === UserRole.ACCOUNT_MANAGER)
  );
  
  return user || null;
};
