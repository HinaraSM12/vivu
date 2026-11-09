export const ROLE_CODES = ['STUDENT', 'FACILITATOR', 'ADMIN'] as const;
export type RoleCode = (typeof ROLE_CODES)[number];

export type AccountStatus = 'active' | 'disabled' | 'locked';

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  roles: RoleCode[];
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshSessionEntity {
  id: string;
  familyId: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  revokedAt?: string;
  rotatedFromId?: string;
  createdAt: string;
}

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

export interface DomainEventRecord {
  eventId: string;
  eventType: string;
  occurredAt: string;
  actorId: string;
  subjectId: string;
  correlationId: string;
  schemaVersion: number;
  payload: Record<string, unknown>;
}

export function buildSessionCapabilities(
  roles: readonly RoleCode[],
): SessionCapabilities {
  const roleSet = new Set<RoleCode>(roles);
  const isStudent = roleSet.has('STUDENT');
  const isFacilitator = roleSet.has('FACILITATOR');
  const isAdmin = roleSet.has('ADMIN');

  return {
    canSelfManageProfile: isStudent,
    canCompleteMissions: isStudent,
    canOperateOffline: isStudent,
    canViewAssignedStudents: isFacilitator || isAdmin,
    canWriteSupportNotesOnline: isFacilitator || isAdmin,
    canManageCatalogsAndRulesOnline: isAdmin,
    canExportAnonymizedDataOnline: isAdmin,
  };
}

