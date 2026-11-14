export type RoleCode = 'STUDENT' | 'PROFESSOR' | 'FACILITATOR' | 'ADMIN';

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

export interface OfflineSessionSnapshot {
  userId: string;
  email: string;
  roles: RoleCode[];
  capabilities: SessionCapabilities;
  lastValidatedOnlineAt: string;
  offlineAccessExpiresAt: string;
}

/**
 * Almacén en memoria preparado para evolucionar a IndexedDB en Sprint 6 (ADR-005).
 * Nunca persiste Bearer tokens en localStorage.
 */
export class SessionSnapshotStore {
  private snapshot: OfflineSessionSnapshot | null = null;

  save(snapshot: OfflineSessionSnapshot): void {
    this.snapshot = {
      ...snapshot,
      roles: [...snapshot.roles],
      capabilities: { ...snapshot.capabilities },
    };
  }

  load(): OfflineSessionSnapshot | null {
    if (!this.snapshot) {
      return null;
    }
    return {
      ...this.snapshot,
      roles: [...this.snapshot.roles],
      capabilities: { ...this.snapshot.capabilities },
    };
  }

  canResumeOffline(nowMs = Date.now()): boolean {
    if (!this.snapshot) {
      return false;
    }
    if (!this.snapshot.capabilities.canOperateOffline) {
      return false;
    }
    const expiresMs = new Date(this.snapshot.offlineAccessExpiresAt).getTime();
    return Number.isFinite(expiresMs) && expiresMs > nowMs;
  }

  clear(): void {
    this.snapshot = null;
  }
}

export const defaultSessionSnapshotStore = new SessionSnapshotStore();
