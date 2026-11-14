export const ROLE_CODES = [
  'STUDENT',
  'PROFESSOR',
  'FACILITATOR',
  'ADMIN',
] as const;
export type RoleCode = (typeof ROLE_CODES)[number];

export const ACCOUNT_STATUSES = ['active', 'disabled', 'locked'] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export interface JwtAccessClaims {
  sub: string;
  roles: RoleCode[];
  iss: string;
  aud: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface SessionCapabilities {
  canSelfManageProfile: boolean;
  canCompleteMissions: boolean;
  canOperateOffline: boolean;
  canContributeResourcesOnline: boolean;
  canViewAssignedStudents: boolean;
  canWriteSupportNotesOnline: boolean;
  canManageCatalogsAndRulesOnline: boolean;
  canExportAnonymizedDataOnline: boolean;
}

export interface SessionUserDto {
  userId: string;
  email: string;
  roles: RoleCode[];
  status: AccountStatus;
  capabilities: SessionCapabilities;
}

export interface AuthSessionResponse {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  offlineAccessWindowSeconds: number;
  user: SessionUserDto;
}

export interface OfflineSessionSnapshot {
  userId: string;
  email: string;
  roles: RoleCode[];
  capabilities: SessionCapabilities;
  lastValidatedOnlineAt: string;
  offlineAccessExpiresAt: string;
}

export interface UserRegisteredEventPayload extends Record<string, unknown> {
  userRole: RoleCode;
}

export function isValidRoleCode(value: unknown): value is RoleCode {
  return (
    typeof value === 'string' &&
    (ROLE_CODES as readonly string[]).includes(value)
  );
}

export function buildCapabilitiesForRoles(
  roles: readonly RoleCode[],
): SessionCapabilities {
  const roleSet = new Set<RoleCode>(roles);
  const isStudent = roleSet.has('STUDENT');
  const isProfessor = roleSet.has('PROFESSOR');
  const isFacilitator = roleSet.has('FACILITATOR');
  const isAdmin = roleSet.has('ADMIN');

  return {
    canSelfManageProfile: isStudent,
    canCompleteMissions: isStudent,
    canOperateOffline: isStudent,
    canContributeResourcesOnline: isProfessor || isAdmin,
    canViewAssignedStudents: isFacilitator || isAdmin,
    canWriteSupportNotesOnline: isFacilitator || isAdmin,
    canManageCatalogsAndRulesOnline: isAdmin,
    canExportAnonymizedDataOnline: isAdmin,
  };
}
