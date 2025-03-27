
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  avatar: string | null;
  module: string;
  action: string;
  details: string;
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  PERMISSIONS_CHANGE = 'permissions_change',
  SETTINGS_CHANGE = 'settings_change',
  OTHER = 'other'
}

