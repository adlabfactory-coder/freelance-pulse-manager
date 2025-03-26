
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types';

// Types pour les entrées d'audit
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

export interface AuditEntry {
  id?: string;
  userId: string;
  userRole: UserRole;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: any;
  timestamp?: Date;
}

// Service d'audit pour enregistrer les actions
export const logAuditEntry = async (entry: AuditEntry): Promise<boolean> => {
  try {
    // En environnement de démo, on ne fait que logger dans la console
    console.log('AUDIT LOG:', {
      ...entry,
      timestamp: entry.timestamp || new Date()
    });
    
    // En production, cela enregistrerait dans une table d'audit Supabase
    // const { error } = await supabase
    //   .from('audit_logs')
    //   .insert({
    //     user_id: entry.userId,
    //     user_role: entry.userRole,
    //     action: entry.action,
    //     resource: entry.resource,
    //     resource_id: entry.resourceId,
    //     details: entry.details,
    //     created_at: entry.timestamp || new Date()
    //   });
    
    // return !error;
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'audit:', error);
    return false;
  }
};

// Méthodes utilitaires pour simplifier la journalisation
export const auditCreate = (userId: string, userRole: UserRole, resource: string, resourceId: string, details?: any): Promise<boolean> => {
  return logAuditEntry({
    userId,
    userRole,
    action: AuditAction.CREATE,
    resource,
    resourceId,
    details
  });
};

export const auditUpdate = (userId: string, userRole: UserRole, resource: string, resourceId: string, details?: any): Promise<boolean> => {
  return logAuditEntry({
    userId,
    userRole,
    action: AuditAction.UPDATE,
    resource,
    resourceId,
    details
  });
};

export const auditDelete = (userId: string, userRole: UserRole, resource: string, resourceId: string, details?: any): Promise<boolean> => {
  return logAuditEntry({
    userId,
    userRole,
    action: AuditAction.DELETE,
    resource,
    resourceId,
    details
  });
};

export const auditPermissionsChange = (userId: string, userRole: UserRole, targetUserId: string, details: any): Promise<boolean> => {
  return logAuditEntry({
    userId,
    userRole,
    action: AuditAction.PERMISSIONS_CHANGE,
    resource: 'user_permissions',
    resourceId: targetUserId,
    details
  });
};

export default {
  logAuditEntry,
  auditCreate,
  auditUpdate,
  auditDelete,
  auditPermissionsChange
};
