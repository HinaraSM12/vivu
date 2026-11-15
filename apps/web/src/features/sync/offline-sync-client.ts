import {
  defaultRecommendationClient,
  type RecommendationView,
} from '../recommendations/recommendation-client';

export type ConnectivityState = 'ONLINE' | 'OFFLINE';

export type OfflineActionType =
  | 'MISSION_ACCEPT'
  | 'MISSION_START'
  | 'MISSION_PAUSE'
  | 'MISSION_SKIP'
  | 'MISSION_COMPLETE'
  | 'SURVEY_SUBMIT'
  | 'RECOVERY_ACTIVATE'
  | 'RECOMMENDATION_ACTION'
  | 'PROFILE_UPDATE';

export type OutboxItemStatus =
  | 'PENDING'
  | 'SYNCING'
  | 'SYNCED'
  | 'CONFLICT_RESOLVED'
  | 'FAILED';

export interface OutboxActionView {
  clientEventId: string;
  studentId: string;
  actionType: OfflineActionType;
  summary: string;
  occurredAt: string;
  status: OutboxItemStatus;
  retryCount: number;
  syncedAt: string | null;
}

export interface SyncStatusSummaryView {
  connectivity: ConnectivityState;
  pendingCount: number;
  syncedCount: number;
  lastSyncedAt: string | null;
  serverCursor: string;
  outbox: OutboxActionView[];
}

const STORAGE_KEY_SYNC = 'vivu.sprint6.sync.v1';

interface StoredSyncState {
  connectivity: ConnectivityState;
  lastSyncedAt: string | null;
  serverCursor: string;
  byStudent: Record<string, OutboxActionView[]>;
}

export class OfflineSyncClient {
  private loadState(): StoredSyncState {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_SYNC);
      if (!raw) {
        return {
          connectivity: 'ONLINE',
          lastSyncedAt: new Date().toISOString(),
          serverCursor: 'cursor-v1-1',
          byStudent: {},
        };
      }
      return JSON.parse(raw) as StoredSyncState;
    } catch {
      return {
        connectivity: 'ONLINE',
        lastSyncedAt: new Date().toISOString(),
        serverCursor: 'cursor-v1-1',
        byStudent: {},
      };
    }
  }

  private saveState(state: StoredSyncState): void {
    try {
      window.localStorage.setItem(STORAGE_KEY_SYNC, JSON.stringify(state));
    } catch {
      // Ignore storage errors in sandbox environments
    }
  }

  getSyncSummary(studentId: string): SyncStatusSummaryView {
    const state = this.loadState();
    const outbox = state.byStudent[studentId] ?? [];
    const pendingCount = outbox.filter((i) => i.status === 'PENDING').length;
    const syncedCount = outbox.filter(
      (i) => i.status === 'SYNCED' || i.status === 'CONFLICT_RESOLVED',
    ).length;

    return {
      connectivity: state.connectivity,
      pendingCount,
      syncedCount,
      lastSyncedAt: state.lastSyncedAt,
      serverCursor: state.serverCursor,
      outbox,
    };
  }

  setConnectivity(
    studentId: string,
    mode: ConnectivityState,
  ): SyncStatusSummaryView {
    const state = this.loadState();
    state.connectivity = mode;
    this.saveState(state);
    return this.getSyncSummary(studentId);
  }

  enqueueOfflineAction(
    studentId: string,
    actionType: OfflineActionType,
    summary: string,
  ): SyncStatusSummaryView {
    const state = this.loadState();
    const list = state.byStudent[studentId] ?? [];
    const nowIso = new Date().toISOString();
    const item: OutboxActionView = {
      clientEventId: `offline-evt-${Date.now()}-${list.length + 1}`,
      studentId,
      actionType,
      summary,
      occurredAt: nowIso,
      status: state.connectivity === 'OFFLINE' ? 'PENDING' : 'SYNCED',
      retryCount: 0,
      syncedAt: state.connectivity === 'ONLINE' ? nowIso : null,
    };
    state.byStudent[studentId] = [item, ...list];
    if (state.connectivity === 'ONLINE') {
      state.lastSyncedAt = nowIso;
    }
    this.saveState(state);
    return this.getSyncSummary(studentId);
  }

  flushOutbox(studentId: string): SyncStatusSummaryView {
    const state = this.loadState();
    state.connectivity = 'ONLINE';
    const nowIso = new Date().toISOString();
    const list = state.byStudent[studentId] ?? [];

    state.byStudent[studentId] = list.map((item) =>
      item.status === 'PENDING'
        ? {
            ...item,
            status: 'SYNCED',
            syncedAt: nowIso,
          }
        : item,
    );
    state.lastSyncedAt = nowIso;
    state.serverCursor = `cursor-v1-${Date.now()}`;
    this.saveState(state);
    return this.getSyncSummary(studentId);
  }

  generateOfflineDeterministicRecommendations(
    studentId: string,
  ): RecommendationView[] {
    const base = defaultRecommendationClient.refreshRecommendations(
      studentId,
      'disabled',
    );
    return base.map((item) => ({
      ...item,
      source: 'OFFLINE_RULES',
      promptVersion: null,
      modelVersion: null,
      fallbackUsed: true,
      whyThisRecommendation: `[Modo sin conexión — Regla determinista local v${item.ruleVersion}] ${item.whyThisRecommendation}`,
    }));
  }
}

export const defaultOfflineSyncClient = new OfflineSyncClient();
