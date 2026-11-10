import {
  defaultSessionSnapshotStore,
  type OfflineSessionSnapshot,
  type RoleCode,
  type SessionCapabilities,
} from '../../local-data/session-snapshot';

export interface SessionUser {
  userId: string;
  email: string;
  roles: RoleCode[];
  status: 'active' | 'disabled' | 'locked';
  capabilities: SessionCapabilities;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  offlineAccessWindowSeconds: number;
  user: SessionUser;
}

export const SEED_DEMO_PASSWORD = 'VivuPilot#2026_dev_only';

function buildCapabilities(roles: readonly RoleCode[]): SessionCapabilities {
  const isStudent = roles.includes('STUDENT');
  const isFacilitator = roles.includes('FACILITATOR');
  const isAdmin = roles.includes('ADMIN');

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

interface LocalAccountRecord {
  userId: string;
  email: string;
  password: string;
  roles: RoleCode[];
  status: 'active' | 'disabled' | 'locked';
}

const INITIAL_LOCAL_ACCOUNTS: readonly LocalAccountRecord[] = [
  {
    userId: '00000000-0000-4000-8000-000000000001',
    email: 'admin.piloto@vivu.local',
    password: SEED_DEMO_PASSWORD,
    roles: ['ADMIN'],
    status: 'active',
  },
  {
    userId: '00000000-0000-4000-8000-000000000002',
    email: 'facilitador.ingenieria@vivu.local',
    password: SEED_DEMO_PASSWORD,
    roles: ['FACILITATOR'],
    status: 'active',
  },
  {
    userId: '00000000-0000-4000-8000-000000000004',
    email: 'est.activo@vivu.local',
    password: SEED_DEMO_PASSWORD,
    roles: ['STUDENT'],
    status: 'active',
  },
  {
    userId: '00000000-0000-4000-8000-000000000005',
    email: 'est.recuperacion@vivu.local',
    password: SEED_DEMO_PASSWORD,
    roles: ['STUDENT'],
    status: 'active',
  },
  {
    userId: '00000000-0000-4000-8000-000000000007',
    email: 'est.deshabilitado@vivu.local',
    password: SEED_DEMO_PASSWORD,
    roles: ['STUDENT'],
    status: 'disabled',
  },
];

export class AuthClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AuthClientError';
  }
}

export class AuthClient {
  private readonly accounts = new Map<string, LocalAccountRecord>();
  private activeAccessToken: string | null = null;
  private activeRefreshToken: string | null = null;

  constructor() {
    this.resetAccounts();
  }

  resetAccounts(): void {
    this.accounts.clear();
    for (const acc of INITIAL_LOCAL_ACCOUNTS) {
      this.accounts.set(acc.email.toLowerCase(), { ...acc });
    }
    this.activeAccessToken = null;
    this.activeRefreshToken = null;
    defaultSessionSnapshotStore.clear();
  }

  getAccessTokenInMemory(): string | null {
    return this.activeAccessToken;
  }

  registerStudent(input: {
    email: string;
    password: string;
    confirmPassword: string;
  }): AuthSession {
    const email = input.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new AuthClientError(
        'INVALID_EMAIL',
        'Ingresa un correo electrónico válido.',
      );
    }

    if (input.password.length < 8) {
      throw new AuthClientError(
        'WEAK_PASSWORD',
        'La contraseña debe tener al menos 8 caracteres.',
      );
    }

    if (input.password !== input.confirmPassword) {
      throw new AuthClientError(
        'PASSWORD_MISMATCH',
        'La confirmación de contraseña no coincide.',
      );
    }

    if (this.accounts.has(email)) {
      throw new AuthClientError(
        'EMAIL_ALREADY_REGISTERED',
        'Ya existe una cuenta registrada con este correo.',
      );
    }

    const record: LocalAccountRecord = {
      userId: `stu-${Date.now()}`,
      email,
      password: input.password,
      roles: ['STUDENT'],
      status: 'active',
    };
    this.accounts.set(email, record);

    return this.establishSession(record);
  }

  login(input: { email: string; password: string }): AuthSession {
    const email = input.email.trim().toLowerCase();
    const record = this.accounts.get(email);

    if (!record || record.password !== input.password) {
      throw new AuthClientError(
        'INVALID_CREDENTIALS',
        'Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.',
      );
    }

    if (record.status !== 'active') {
      throw new AuthClientError(
        'USER_DISABLED',
        'Esta cuenta no se encuentra activa actualmente. Contacta a la coordinación del piloto.',
      );
    }

    return this.establishSession(record);
  }

  logout(): void {
    this.activeAccessToken = null;
    this.activeRefreshToken = null;
    defaultSessionSnapshotStore.clear();
  }

  getOfflineSnapshot(): OfflineSessionSnapshot | null {
    return defaultSessionSnapshotStore.load();
  }

  private establishSession(record: LocalAccountRecord): AuthSession {
    const capabilities = buildCapabilities(record.roles);
    const offlineWindowSeconds = capabilities.canOperateOffline
      ? 72 * 60 * 60
      : 0;
    const now = Date.now();

    const session: AuthSession = {
      accessToken: `mem_at_${record.userId}_${now}`,
      refreshToken: `mem_rt_${record.userId}_${now}`,
      expiresInSeconds: 900,
      offlineAccessWindowSeconds: offlineWindowSeconds,
      user: {
        userId: record.userId,
        email: record.email,
        roles: [...record.roles],
        status: record.status,
        capabilities,
      },
    };

    this.activeAccessToken = session.accessToken;
    this.activeRefreshToken = session.refreshToken;

    defaultSessionSnapshotStore.save({
      userId: record.userId,
      email: record.email,
      roles: [...record.roles],
      capabilities,
      lastValidatedOnlineAt: new Date(now).toISOString(),
      offlineAccessExpiresAt: new Date(
        now + offlineWindowSeconds * 1000,
      ).toISOString(),
    });

    return session;
  }
}

export const defaultAuthClient = new AuthClient();

