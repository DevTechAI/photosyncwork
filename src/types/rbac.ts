/**
 * Role-Based Access Control (RBAC) Types
 */

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  resource: string;
  action: string;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_by?: string;
  assigned_at: string;
  is_active: boolean;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
}

/**
 * Permission check result
 */
export interface PermissionCheck {
  hasPermission: boolean;
  roles: string[];
  permissions: string[];
}

/**
 * User with roles and permissions
 */
export interface UserWithRoles {
  id: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
  primaryRole?: Role;
}

/**
 * Resource-action permission mapping
 */
export type ResourceAction = `${string}.${string}`;

/**
 * Permission constants for easy reference
 */
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view' as const,
  
  // Estimates
  ESTIMATES_CREATE: 'estimates.create' as const,
  ESTIMATES_VIEW: 'estimates.view' as const,
  ESTIMATES_EDIT: 'estimates.edit' as const,
  ESTIMATES_DELETE: 'estimates.delete' as const,
  ESTIMATES_APPROVE: 'estimates.approve' as const,
  
  // Invoices
  INVOICES_CREATE: 'invoices.create' as const,
  INVOICES_VIEW: 'invoices.view' as const,
  INVOICES_EDIT: 'invoices.edit' as const,
  INVOICES_DELETE: 'invoices.delete' as const,
  INVOICES_PAYMENT: 'invoices.payment' as const,
  
  // Finances
  FINANCES_VIEW: 'finances.view' as const,
  FINANCES_MANAGE: 'finances.manage' as const,
  FINANCES_REPORTS: 'finances.reports' as const,
  
  // Workflow
  WORKFLOW_VIEW: 'workflow.view' as const,
  WORKFLOW_MANAGE: 'workflow.manage' as const,
  WORKFLOW_ASSIGN: 'workflow.assign' as const,
  
  // Team
  TEAM_VIEW: 'team.view' as const,
  TEAM_MANAGE: 'team.manage' as const,
  TEAM_ASSIGN: 'team.assign' as const,
  
  // Portfolio
  PORTFOLIO_CREATE: 'portfolio.create' as const,
  PORTFOLIO_VIEW: 'portfolio.view' as const,
  PORTFOLIO_EDIT: 'portfolio.edit' as const,
  
  // Clients
  CLIENTS_VIEW: 'clients.view' as const,
  CLIENTS_MANAGE: 'clients.manage' as const,
  
  // Settings
  SETTINGS_VIEW: 'settings.view' as const,
  SETTINGS_MANAGE: 'settings.manage' as const,
} as const;

/**
 * Role constants
 */
export const ROLES = {
  MANAGER: 'manager' as const,
  PHOTOGRAPHER: 'photographer' as const,
  VIDEOGRAPHER: 'videographer' as const,
  EDITOR: 'editor' as const,
  ACCOUNTS: 'accounts' as const,
  CRM: 'crm' as const,
} as const;