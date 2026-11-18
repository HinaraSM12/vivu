import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { Injectable } from '@nestjs/common';

export interface DurableGatewaySnapshot {
  schemaVersion: '1.0.0';
  updatedAt: string;
  completedMissionsByStudent: Record<string, string[]>;
  withdrawnConsentStudents: string[];
  appliedClientEventIds: string[];
}

const EMPTY_SNAPSHOT: DurableGatewaySnapshot = {
  schemaVersion: '1.0.0',
  updatedAt: '2026-11-18T00:00:00.000Z',
  completedMissionsByStudent: {},
  withdrawnConsentStudents: [],
  appliedClientEventIds: [],
};

@Injectable()
export class GatewayJsonSnapshotStore {
  private readonly snapshotPath: string | null;
  private state: DurableGatewaySnapshot;

  constructor() {
    this.snapshotPath =
      process.env.VIVU_STATE_SNAPSHOT_PATH?.trim() || null;
    this.state = this.loadFromDisk();
  }

  getSnapshotPath(): string | null {
    return this.snapshotPath;
  }

  getState(): DurableGatewaySnapshot {
    return this.state;
  }

  recordMissionCompleted(studentId: string, missionCode: string): void {
    const list = this.state.completedMissionsByStudent[studentId] ?? [];
    if (!list.includes(missionCode)) {
      this.state.completedMissionsByStudent[studentId] = [...list, missionCode];
      this.flushToDisk();
    }
  }

  getCompletedMissions(studentId: string): string[] {
    return [...(this.state.completedMissionsByStudent[studentId] ?? [])];
  }

  recordConsentWithdrawn(studentId: string): void {
    if (!this.state.withdrawnConsentStudents.includes(studentId)) {
      this.state.withdrawnConsentStudents.push(studentId);
      this.flushToDisk();
    }
  }

  recordConsentAccepted(studentId: string): void {
    const idx = this.state.withdrawnConsentStudents.indexOf(studentId);
    if (idx !== -1) {
      this.state.withdrawnConsentStudents.splice(idx, 1);
      this.flushToDisk();
    }
  }

  isConsentWithdrawn(studentId: string): boolean {
    return this.state.withdrawnConsentStudents.includes(studentId);
  }

  recordAppliedClientEventId(clientEventId: string): void {
    if (!this.state.appliedClientEventIds.includes(clientEventId)) {
      this.state.appliedClientEventIds.push(clientEventId);
      this.flushToDisk();
    }
  }

  hasAppliedClientEventId(clientEventId: string): boolean {
    return this.state.appliedClientEventIds.includes(clientEventId);
  }

  private loadFromDisk(): DurableGatewaySnapshot {
    if (!this.snapshotPath || !existsSync(this.snapshotPath)) {
      return {
        ...EMPTY_SNAPSHOT,
        completedMissionsByStudent: {},
        withdrawnConsentStudents: [],
        appliedClientEventIds: [],
      };
    }
    try {
      const raw = readFileSync(this.snapshotPath, 'utf8');
      const parsed = JSON.parse(raw) as Partial<DurableGatewaySnapshot>;
      return {
        schemaVersion: '1.0.0',
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
        completedMissionsByStudent: parsed.completedMissionsByStudent ?? {},
        withdrawnConsentStudents: parsed.withdrawnConsentStudents ?? [],
        appliedClientEventIds: parsed.appliedClientEventIds ?? [],
      };
    } catch {
      return {
        ...EMPTY_SNAPSHOT,
        completedMissionsByStudent: {},
        withdrawnConsentStudents: [],
        appliedClientEventIds: [],
      };
    }
  }

  private flushToDisk(): void {
    this.state.updatedAt = new Date().toISOString();
    if (!this.snapshotPath) {
      return;
    }
    mkdirSync(dirname(this.snapshotPath), { recursive: true });
    writeFileSync(
      this.snapshotPath,
      JSON.stringify(this.state, null, 2),
      'utf8',
    );
  }
}

