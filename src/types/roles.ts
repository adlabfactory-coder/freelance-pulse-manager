
import { UserRole } from './index';

// Export UserRole for direct imports from this file
export { UserRole };

// Définition des étiquettes des rôles pour l'affichage
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  'super_admin': 'Super Admin',
  'admin': 'Administrateur',
  'freelancer': 'Chargé(e) d\'affaires',
  'account_manager': 'Chargé(e) de compte',
  'client': 'Client'
};

// Hiérarchie des rôles (du plus élevé au plus bas)
export const ROLE_HIERARCHY: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.ACCOUNT_MANAGER,
  UserRole.FREELANCER,
  UserRole.CLIENT
];

// Helper function to check if one role is at least as high as another
export const hasMinimumRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  // Lower index means higher role in the hierarchy
  return userRoleIndex !== -1 && requiredRoleIndex !== -1 && userRoleIndex <= requiredRoleIndex;
};

// Interface pour les permissions par rôle
export interface RolePermission {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
  roles: UserRole[];
}

// Catégories de permissions pour organiser l'interface
export enum PermissionCategory {
  USERS = "Utilisateurs",
  CONTACTS = "Contacts",
  APPOINTMENTS = "Rendez-vous",
  QUOTES = "Devis",
  SUBSCRIPTIONS = "Abonnements",
  COMMISSIONS = "Commissions",
  REPORTS = "Rapports",
  SETTINGS = "Paramètres",
  API = "API",
  SYSTEM = "Système"
}

// Permissions par défaut avec catégories
export const DEFAULT_PERMISSIONS: RolePermission[] = [
  // ---- PERMISSIONS UTILISATEURS ----
  {
    id: "view_users",
    name: "Voir les utilisateurs",
    description: "Consulter la liste des utilisateurs",
    category: PermissionCategory.USERS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER]
  },
  {
    id: "create_users",
    name: "Créer des utilisateurs",
    description: "Ajouter de nouveaux utilisateurs",
    category: PermissionCategory.USERS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "edit_users",
    name: "Modifier des utilisateurs",
    description: "Modifier les informations des utilisateurs",
    category: PermissionCategory.USERS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "delete_users",
    name: "Supprimer des utilisateurs",
    description: "Supprimer définitivement des utilisateurs",
    category: PermissionCategory.USERS,
    roles: [UserRole.SUPER_ADMIN]
  },
  {
    id: "manage_roles",
    name: "Gérer les rôles",
    description: "Définir les rôles et permissions des utilisateurs",
    category: PermissionCategory.USERS,
    roles: [UserRole.SUPER_ADMIN]
  },

  // ---- PERMISSIONS CONTACTS ----
  {
    id: "view_contacts",
    name: "Voir les contacts",
    description: "Consulter la liste des contacts",
    category: PermissionCategory.CONTACTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER]
  },
  {
    id: "create_contacts",
    name: "Créer des contacts",
    description: "Ajouter de nouveaux contacts",
    category: PermissionCategory.CONTACTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER]
  },
  {
    id: "edit_contacts",
    name: "Modifier des contacts",
    description: "Modifier les informations des contacts",
    category: PermissionCategory.CONTACTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER]
  },
  {
    id: "delete_contacts",
    name: "Supprimer des contacts",
    description: "Supprimer définitivement des contacts",
    category: PermissionCategory.CONTACTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "assign_contacts",
    name: "Assigner des contacts",
    description: "Assigner des contacts à d'autres utilisateurs",
    category: PermissionCategory.CONTACTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER]
  },
  {
    id: "import_export_contacts",
    name: "Importer/Exporter des contacts",
    description: "Importer ou exporter des listes de contacts",
    category: PermissionCategory.CONTACTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },

  // ---- PERMISSIONS RENDEZ-VOUS ----
  {
    id: "view_appointments",
    name: "Voir les rendez-vous",
    description: "Consulter les rendez-vous",
    category: PermissionCategory.APPOINTMENTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER, UserRole.CLIENT]
  },
  {
    id: "create_appointments",
    name: "Créer des rendez-vous",
    description: "Planifier de nouveaux rendez-vous",
    category: PermissionCategory.APPOINTMENTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER]
  },
  {
    id: "edit_appointments",
    name: "Modifier des rendez-vous",
    description: "Modifier les détails des rendez-vous",
    category: PermissionCategory.APPOINTMENTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER]
  },
  {
    id: "cancel_appointments",
    name: "Annuler des rendez-vous",
    description: "Annuler des rendez-vous existants",
    category: PermissionCategory.APPOINTMENTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER, UserRole.CLIENT]
  },
  {
    id: "view_all_appointments",
    name: "Voir tous les rendez-vous",
    description: "Consulter les rendez-vous de tous les utilisateurs",
    category: PermissionCategory.APPOINTMENTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },

  // ---- PERMISSIONS DEVIS ----
  {
    id: "view_quotes",
    name: "Voir les devis",
    description: "Consulter les devis",
    category: PermissionCategory.QUOTES,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER]
  },
  {
    id: "create_quotes",
    name: "Créer des devis",
    description: "Créer de nouveaux devis",
    category: PermissionCategory.QUOTES,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER]
  },
  {
    id: "edit_quotes",
    name: "Modifier des devis",
    description: "Modifier les devis existants",
    category: PermissionCategory.QUOTES,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER]
  },
  {
    id: "delete_quotes",
    name: "Supprimer des devis",
    description: "Supprimer définitivement des devis",
    category: PermissionCategory.QUOTES,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "approve_quotes",
    name: "Approuver des devis",
    description: "Modifier le statut des devis (accepté, refusé, etc.)",
    category: PermissionCategory.QUOTES,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER]
  },
  {
    id: "view_all_quotes",
    name: "Voir tous les devis",
    description: "Consulter les devis de tous les utilisateurs",
    category: PermissionCategory.QUOTES,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },

  // ---- PERMISSIONS ABONNEMENTS ----
  {
    id: "view_subscriptions",
    name: "Voir les abonnements",
    description: "Consulter les abonnements",
    category: PermissionCategory.SUBSCRIPTIONS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER]
  },
  {
    id: "create_subscriptions",
    name: "Créer des abonnements",
    description: "Créer de nouveaux abonnements",
    category: PermissionCategory.SUBSCRIPTIONS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER]
  },
  {
    id: "edit_subscriptions",
    name: "Modifier des abonnements",
    description: "Modifier les abonnements existants",
    category: PermissionCategory.SUBSCRIPTIONS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER]
  },
  {
    id: "cancel_subscriptions",
    name: "Annuler des abonnements",
    description: "Annuler ou désactiver des abonnements",
    category: PermissionCategory.SUBSCRIPTIONS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "manage_subscription_plans",
    name: "Gérer les plans d'abonnement",
    description: "Créer et modifier les plans d'abonnement disponibles",
    category: PermissionCategory.SUBSCRIPTIONS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },

  // ---- PERMISSIONS COMMISSIONS ----
  {
    id: "view_commissions",
    name: "Voir les commissions",
    description: "Consulter ses propres commissions",
    category: PermissionCategory.COMMISSIONS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER]
  },
  {
    id: "view_all_commissions",
    name: "Voir toutes les commissions",
    description: "Consulter les commissions de tous les utilisateurs",
    category: PermissionCategory.COMMISSIONS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "approve_commissions",
    name: "Approuver des commissions",
    description: "Approuver le paiement des commissions",
    category: PermissionCategory.COMMISSIONS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "edit_commissions",
    name: "Modifier des commissions",
    description: "Modifier les montants ou statuts des commissions",
    category: PermissionCategory.COMMISSIONS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "manage_commission_rules",
    name: "Gérer les règles de commission",
    description: "Définir les règles et taux de commission",
    category: PermissionCategory.COMMISSIONS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },

  // ---- PERMISSIONS RAPPORTS ----
  {
    id: "view_basic_reports",
    name: "Voir les rapports de base",
    description: "Consulter les rapports et statistiques de base",
    category: PermissionCategory.REPORTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER]
  },
  {
    id: "view_advanced_reports",
    name: "Voir les rapports avancés",
    description: "Consulter les rapports et analyses détaillés",
    category: PermissionCategory.REPORTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "export_reports",
    name: "Exporter des rapports",
    description: "Exporter des rapports en différents formats",
    category: PermissionCategory.REPORTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER]
  },
  {
    id: "create_custom_reports",
    name: "Créer des rapports personnalisés",
    description: "Créer et sauvegarder des rapports personnalisés",
    category: PermissionCategory.REPORTS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },

  // ---- PERMISSIONS PARAMÈTRES ----
  {
    id: "edit_personal_settings",
    name: "Modifier ses paramètres personnels",
    description: "Modifier ses propres paramètres",
    category: PermissionCategory.SETTINGS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER, UserRole.CLIENT]
  },
  {
    id: "manage_services",
    name: "Gérer les services",
    description: "Ajouter, modifier ou supprimer des services",
    category: PermissionCategory.SETTINGS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "manage_company_settings",
    name: "Gérer les paramètres de l'entreprise",
    description: "Modifier les paramètres généraux de l'entreprise",
    category: PermissionCategory.SETTINGS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "manage_integrations",
    name: "Gérer les intégrations",
    description: "Configurer les intégrations tierces (Calendly, etc.)",
    category: PermissionCategory.SETTINGS,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },

  // ---- PERMISSIONS API ----
  {
    id: "manage_api_keys",
    name: "Gérer les clés API",
    description: "Créer et révoquer des clés API",
    category: PermissionCategory.API,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "use_api",
    name: "Utiliser l'API",
    description: "Accéder à l'API via des clés API",
    category: PermissionCategory.API,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNT_MANAGER, UserRole.FREELANCER]
  },

  // ---- PERMISSIONS SYSTÈME ----
  {
    id: "view_audit_logs",
    name: "Voir les journaux d'audit",
    description: "Consulter les journaux d'activité du système",
    category: PermissionCategory.SYSTEM,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    id: "system_configuration",
    name: "Configuration système",
    description: "Modifier les paramètres système avancés",
    category: PermissionCategory.SYSTEM,
    roles: [UserRole.SUPER_ADMIN]
  },
  {
    id: "database_management",
    name: "Gestion de la base de données",
    description: "Accéder aux fonctionnalités avancées de la base de données",
    category: PermissionCategory.SYSTEM,
    roles: [UserRole.SUPER_ADMIN]
  },
  {
    id: "backup_restore",
    name: "Sauvegarder et restaurer",
    description: "Effectuer et restaurer des sauvegardes du système",
    category: PermissionCategory.SYSTEM,
    roles: [UserRole.SUPER_ADMIN]
  }
];
