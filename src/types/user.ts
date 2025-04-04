
import { UserRole } from './roles';

// User related interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  supervisor_id?: string | null;
  schedule_enabled?: boolean;
  daily_availability?: Record<string, any> | null;
  weekly_availability?: Record<string, any> | null;
  password?: string; // Adding password field for UserEditForm
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
