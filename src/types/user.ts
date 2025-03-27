
import { UserRole } from './roles';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  supervisor_id?: string | null;
  calendly_enabled?: boolean;
  calendly_url?: string;
  calendly_sync_email?: string;
}
