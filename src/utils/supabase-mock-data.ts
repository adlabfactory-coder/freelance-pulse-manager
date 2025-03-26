
import { User, UserRole } from '@/types';

// Fonctions utilitaires pour les données de démonstration
export const getMockUsers = (): User[] => {
  return [
    {
      id: "7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc",
      name: "Admin Démo",
      email: "admin@example.com",
      role: UserRole.ADMIN,
      calendly_url: "https://calendly.com/admin-demo",
      calendly_enabled: true,
      calendly_sync_email: "admin@example.com"
    },
    {
      id: "487fb1af-4396-49d1-ba36-8711facbb03c",
      name: "Freelancer Démo",
      email: "commercial@example.com",
      role: UserRole.FREELANCER,
      calendly_url: "https://calendly.com/commercial-demo",
      calendly_enabled: true,
      calendly_sync_email: "commercial@example.com"
    },
    {
      id: "2b6329d2-73e4-4f5e-b56e-c26cdf4b3dda",
      name: "Client Démo",
      email: "client@example.com",
      role: UserRole.CLIENT,
      calendly_url: "",
      calendly_enabled: false,
      calendly_sync_email: ""
    },
    {
      id: "5a7e1d8f-62b3-4c90-8e1a-9f4d2e89b7a5",
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

// Fonction de simulation d'authentification pour le mode démo
export const mockSignIn = (email: string, password: string): { user: User | null; error: string | null } => {
  // Vérification simplifiée pour le mode démo
  if (password !== "123456") {
    return { user: null, error: "Mot de passe incorrect. Pour les comptes de démonstration, utilisez '123456'." };
  }
  
  const user = getMockUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return { user: null, error: "Cet email n'est pas reconnu. Utilisez un des emails de démonstration." };
  }
  
  return { user, error: null };
};
