
import { UserRole } from './roles';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  supervisor_id?: string | null;
  calendly_enabled?: boolean;
  calendly_url?: string;
  calendly_sync_email?: string;
}

export interface UserAuthData extends User {
  accessToken?: string;
  refreshToken?: string;
}

export interface UserProfile extends User {
  bio?: string;
  position?: string;
  company?: string;
  location?: string;
  skills?: string[];
}
