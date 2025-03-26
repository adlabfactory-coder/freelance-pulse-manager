
import { User, UserRole } from '@/types';

// Fonctions utilitaires pour les données de démonstration
export const getMockUsers = (): User[] => {
  return [
    {
      id: "1",
      name: "Admin Démo",
      email: "admin@example.com",
      role: UserRole.ADMIN,
      calendly_url: "https://calendly.com/admin-demo",
      calendly_enabled: true,
      calendly_sync_email: "admin@example.com"
    },
    {
      id: "2",
      name: "Freelancer Démo",
      email: "commercial@example.com",
      role: UserRole.FREELANCER,
      calendly_url: "https://calendly.com/commercial-demo",
      calendly_enabled: true,
      calendly_sync_email: "commercial@example.com"
    },
    {
      id: "3",
      name: "Client Démo",
      email: "client@example.com",
      role: UserRole.CLIENT,
      calendly_url: "",
      calendly_enabled: false,
      calendly_sync_email: ""
    },
    {
      id: "4",
      name: "Chargé d'affaires Démo",
      email: "freelance@example.com",
      role: UserRole.ACCOUNT_MANAGER,
      calendly_url: "https://calendly.com/freelance-demo",
      calendly_enabled: true,
      calendly_sync_email: "freelance@example.com"
    }
  ];
};

export const getMockUserById = (userId: string): User | null => {
  const mockUsers = getMockUsers();
  const foundUser = mockUsers.find(user => user.id === userId);
  return foundUser || null;
};
