
import { User } from "@/types";
import { UserRole } from "@/types/roles";

// Utilisateurs de démonstration pour le développement
export const getMockUsers = (): User[] => {
  return [
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
};

// Utilisateurs avec accès privilégié
export const isPrivilegedUser = (role: UserRole | null | undefined): boolean => {
  if (!role) return false;
  return [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.ACCOUNT_MANAGER].includes(role);
};

// Récupère un utilisateur approprié selon le rôle
export const getAppropriateUserByRole = (role: UserRole): User => {
  const users = getMockUsers();
  const found = users.find(u => u.role === role);
  return found || users[1]; // Default to Admin if not found
};
