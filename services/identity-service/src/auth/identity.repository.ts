import { Inject, Injectable } from '@nestjs/common';
import type {
  AccountStatus,
  DomainEventRecord,
  RefreshSessionEntity,
  RoleCode,
  UserEntity,
} from './auth.types';
import { PasswordHasher } from './password-hasher';

export const DEFAULT_SEED_PASSWORD = 'VivuPilot#2026_dev_only';

interface SeedUserInput {
  id: string;
  email: string;
  roles: RoleCode[];
  status: AccountStatus;
}

const INITIAL_SEED_USERS: readonly SeedUserInput[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    email: 'admin.piloto@vivu.local',
    roles: ['ADMIN'],
    status: 'active',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    email: 'facilitador.ingenieria@vivu.local',
    roles: ['FACILITATOR'],
    status: 'active',
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    email: 'facilitador.bienestar@vivu.local',
    roles: ['FACILITATOR'],
    status: 'active',
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    email: 'est.activo@vivu.local',
    roles: ['STUDENT'],
    status: 'active',
  },
  {
    id: '00000000-0000-4000-8000-000000000005',
    email: 'est.recuperacion@vivu.local',
    roles: ['STUDENT'],
    status: 'active',
  },
  {
    id: '00000000-0000-4000-8000-000000000006',
    email: 'est.nuevo@vivu.local',
    roles: ['STUDENT'],
    status: 'active',
  },
  {
    id: '00000000-0000-4000-8000-000000000007',
    email: 'est.deshabilitado@vivu.local',
    roles: ['STUDENT'],
    status: 'disabled',
  },
];

@Injectable()
export class IdentityRepository {
  private readonly usersById = new Map<string, UserEntity>();
  private readonly userIdByEmail = new Map<string, string>();
  private readonly refreshSessionsByTokenHash = new Map<
    string,
    RefreshSessionEntity
  >();
  private readonly domainEvents: DomainEventRecord[] = [];

  constructor(
    @Inject(PasswordHasher) private readonly passwordHasher: PasswordHasher,
  ) {
    this.seedDefaults();
  }

  seedDefaults(): void {
    const nowIso = new Date().toISOString();
    const defaultPasswordHash = this.passwordHasher.hash(DEFAULT_SEED_PASSWORD);

    for (const seed of INITIAL_SEED_USERS) {
      const normalizedEmail = seed.email.trim().toLowerCase();
      const entity: UserEntity = {
        id: seed.id,
        email: normalizedEmail,
        passwordHash: defaultPasswordHash,
        roles: [...seed.roles],
        status: seed.status,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      this.usersById.set(entity.id, entity);
      this.userIdByEmail.set(normalizedEmail, entity.id);
    }
  }

  findUserByEmail(email: string): UserEntity | undefined {
    const normalizedEmail = email.trim().toLowerCase();
    const userId = this.userIdByEmail.get(normalizedEmail);
    if (!userId) {
      return undefined;
    }
    return this.usersById.get(userId);
  }

  findUserById(userId: string): UserEntity | undefined {
    return this.usersById.get(userId);
  }

  saveUser(user: UserEntity): UserEntity {
    const normalizedEmail = user.email.trim().toLowerCase();
    const stored: UserEntity = {
      ...user,
      email: normalizedEmail,
      roles: [...user.roles],
    };
    this.usersById.set(stored.id, stored);
    this.userIdByEmail.set(normalizedEmail, stored.id);
    return stored;
  }

  saveRefreshSession(session: RefreshSessionEntity): RefreshSessionEntity {
    this.refreshSessionsByTokenHash.set(session.tokenHash, { ...session });
    return session;
  }

  findRefreshSessionByTokenHash(
    tokenHash: string,
  ): RefreshSessionEntity | undefined {
    const session = this.refreshSessionsByTokenHash.get(tokenHash);
    return session ? { ...session } : undefined;
  }

  revokeRefreshSessionByTokenHash(tokenHash: string, revokedAt: string): void {
    const existing = this.refreshSessionsByTokenHash.get(tokenHash);
    if (existing && !existing.revokedAt) {
      this.refreshSessionsByTokenHash.set(tokenHash, {
        ...existing,
        revokedAt,
      });
    }
  }

  revokeRefreshSessionFamily(familyId: string, revokedAt: string): void {
    for (const [hash, session] of this.refreshSessionsByTokenHash.entries()) {
      if (session.familyId === familyId && !session.revokedAt) {
        this.refreshSessionsByTokenHash.set(hash, {
          ...session,
          revokedAt,
        });
      }
    }
  }

  appendDomainEvent(event: DomainEventRecord): void {
    this.domainEvents.push(event);
  }

  getDomainEvents(): readonly DomainEventRecord[] {
    return [...this.domainEvents];
  }
}

