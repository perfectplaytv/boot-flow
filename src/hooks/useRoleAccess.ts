import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'admin' | 'reseller' | 'client';

export interface RolePermissions {
  canViewDashboard: boolean;
  canManageUsers: boolean;
  canManageResellers: boolean;
  canManageClients: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canExportData: boolean;
  canManageBilling: boolean;
}

const rolePermissionsMap: Record<UserRole, RolePermissions> = {
  admin: {
    canViewDashboard: true,
    canManageUsers: true,
    canManageResellers: true,
    canManageClients: true,
    canViewAnalytics: true,
    canManageSettings: true,
    canExportData: true,
    canManageBilling: true,
  },
  reseller: {
    canViewDashboard: true,
    canManageUsers: false,
    canManageResellers: false,
    canManageClients: true,
    canViewAnalytics: true,
    canManageSettings: false,
    canExportData: true,
    canManageBilling: true,
  },
  client: {
    canViewDashboard: true,
    canManageUsers: false,
    canManageResellers: false,
    canManageClients: false,
    canViewAnalytics: false,
    canManageSettings: false,
    canExportData: false,
    canManageBilling: false,
  },
};

export const useRoleAccess = () => {
  const { userRole, user } = useAuth();

  const permissions = useMemo<RolePermissions | null>(() => {
    if (!userRole || !user) return null;
    return rolePermissionsMap[userRole] || rolePermissionsMap.client;
  }, [userRole, user]);

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!userRole) return false;
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    return userRole === role;
  };

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions?.[permission] ?? false;
  };

  return {
    role: userRole,
    permissions,
    hasRole,
    hasPermission,
    isAdmin: userRole === 'admin',
    isReseller: userRole === 'reseller',
    isClient: userRole === 'client',
  };
};

