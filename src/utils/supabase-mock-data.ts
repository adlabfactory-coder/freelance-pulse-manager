
import { User, UserRole } from "@/types";

export const getMockUsers = (): User[] => {
  return [
    {
      id: '7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc',
      name: 'Super Admin Démo',
      email: 'superadmin@example.com',
      role: UserRole.SUPER_ADMIN,
      avatar: null,
      supervisor_id: null
    },
    {
      id: '6a94bd3d-7f5c-49ae-b09e-e570cb01a978',
      name: 'Admin Démo',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      avatar: null,
      supervisor_id: '7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc'
    },
    {
      id: '487fb1af-4396-49d1-ba36-8711facbb03c',
      name: 'Freelancer Démo',
      email: 'freelancer@example.com',
      role: UserRole.FREELANCER,
      avatar: null,
      supervisor_id: '6a94bd3d-7f5c-49ae-b09e-e570cb01a978'
    },
    {
      id: '3f8e3f1c-c6f9-4c04-a0b9-88d7f6d8e05c',
      name: 'Chargé de Compte Démo',
      email: 'account@example.com',
      role: UserRole.ACCOUNT_MANAGER,
      avatar: null,
      supervisor_id: '6a94bd3d-7f5c-49ae-b09e-e570cb01a978'
    }
  ];
};

export const getMockUserById = (id: string): User | null => {
  const users = getMockUsers();
  return users.find(user => user.id === id) || null;
};
