
export * from './navigation';
export * from './roles';
export * from './audit';

// Interfaces de base
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string | null;
}
