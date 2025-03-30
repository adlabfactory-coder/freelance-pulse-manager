
import { UserRole } from "@/types/roles";

export interface DemoUser {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  description: string;
}

export const demoUsers: DemoUser[] = [
  {
    email: "admin@example.com",
    password: "123456",
    role: UserRole.ADMIN,
    name: "Admin Demo",
    description: "Accès complet à la plateforme sauf fonctions super admin"
  },
  {
    email: "super@example.com",
    password: "123456",
    role: UserRole.SUPER_ADMIN,
    name: "Super Admin",
    description: "Accès complet à toutes les fonctionnalités de la plateforme"
  },
  {
    email: "commercial@example.com",
    password: "123456",
    role: UserRole.ACCOUNT_MANAGER,
    name: "Commercial Demo",
    description: "Chargé d'affaires avec accès aux contacts et devis"
  },
  {
    email: "freelance@example.com",
    password: "123456",
    role: UserRole.FREELANCER,
    name: "Freelance Demo",
    description: "Accès limité aux tâches et commissions personnelles"
  }
];

export const getUserByEmail = (email: string): DemoUser | undefined => {
  return demoUsers.find(user => user.email === email);
};

export const getAllUsers = async (): Promise<DemoUser[]> => {
  return demoUsers;
};
