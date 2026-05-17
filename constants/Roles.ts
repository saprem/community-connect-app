export const UserRoles = {
  OWNER: 'owner',
  TENANT: 'tenant',
  SECURITY: 'security',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];

export const RolePermissions = {
  [UserRoles.OWNER]: {
    canApproveVisitors: true,
    canMakePayments: true,
    canPostInCommunity: true,
    canBookFacilities: true,
    canManageTenants: true,
    canAccessAnalytics: false,
    canManageVendors: false,
  },
  [UserRoles.TENANT]: {
    canApproveVisitors: true,
    canMakePayments: true,
    canPostInCommunity: true,
    canBookFacilities: true,
    canManageTenants: false,
    canAccessAnalytics: false,
    canManageVendors: false,
  },
  [UserRoles.SECURITY]: {
    canApproveVisitors: true,
    canMakePayments: false,
    canPostInCommunity: false,
    canBookFacilities: false,
    canManageTenants: false,
    canAccessAnalytics: false,
    canManageVendors: false,
  },
  [UserRoles.ADMIN]: {
    canApproveVisitors: true,
    canMakePayments: true,
    canPostInCommunity: true,
    canBookFacilities: true,
    canManageTenants: true,
    canAccessAnalytics: true,
    canManageVendors: true,
  },
};

export const RoleLabels = {
  [UserRoles.OWNER]: 'Owner',
  [UserRoles.TENANT]: 'Tenant',
  [UserRoles.SECURITY]: 'Security Guard',
  [UserRoles.ADMIN]: 'Admin',
};
