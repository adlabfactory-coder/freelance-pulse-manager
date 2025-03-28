
export interface AuditLog {
  id: string;
  timestamp: string;
  user_id?: string;
  user_email?: string;
  user_role?: string;
  action: string; // 'create', 'read', 'update', 'delete', 'login', 'logout', 'error', etc.
  module: string; // 'users', 'contacts', 'quotes', 'auth', etc.
  details: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

export type AuditFilter = {
  startDate: Date;
  endDate: Date;
  module?: string;
  action?: string;
  searchTerm?: string;
};
