
import { User } from "@/types";
import { UserRole } from "@/types/roles";

// Données mocquées pour la démonstration
const mockUsers = [
  {
    id: '7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc',
    name: 'Super Admin Démo',
    email: 'superadmin@example.com',
    role: UserRole.SUPER_ADMIN,
    avatar: null
  },
  {
    id: '6a94bd3d-7f5c-49ae-b09e-e570cb01a978',
    name: 'Admin Démo',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    avatar: null
  },
  {
    id: '487fb1af-4396-49d1-ba36-8711facbb03c',
    name: 'Freelancer Démo',
    email: 'freelancer@example.com',
    role: UserRole.FREELANCER,
    avatar: null
  },
  {
    id: '3f8e3f1c-c6f9-4c04-a0b9-88d7f6d8e05c',
    name: 'Chargé de Compte Démo',
    email: 'account@example.com',
    role: UserRole.ACCOUNT_MANAGER,
    avatar: null
  }
];

export const mockAuthentication = async (email: string = 'admin@example.com'): Promise<User | null> => {
  // En mode développement ou démo, on peut retourner un utilisateur mocké
  const mockUser = mockUsers.find(user => user.email === email) || mockUsers[1]; // Par défaut, l'admin
  console.log("Authentification mocquée avec:", mockUser);
  return mockUser;
};
