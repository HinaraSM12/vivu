import {
  createHash,
  createHmac,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

export const ROLE_CODES = [
  'STUDENT',
  'PROFESSOR',
  'FACILITATOR',
  'ADMIN',
] as const;
export type RoleCode = (typeof ROLE_CODES)[number];
export type AccountStatus = 'active' | 'disabled' | 'locked';

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

interface StoredGatewayUser {
  id: string;
  email: string;
  passwordHash: string;
  roles: RoleCode[];
  status: AccountStatus;
}

interface StoredRefreshSession {
  id: string;
  familyId: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  revokedAt?: string;
}

export const DEFAULT_GATEWAY_SEED_PASSWORD = 'VivuPilot#2026_dev_only';
const KEY_LENGTH = 64;
const ACCESS_TTL_SECONDS = 900;
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const OFFLINE_ACCESS_WINDOW_SECONDS = 72 * 60 * 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8');
}

export function buildCapabilities(
  roles: readonly RoleCode[],
): SessionCapabilities {
  const set = new Set<RoleCode>(roles);
  const isStudent = set.has('STUDENT');
  const isProfessor = set.has('PROFESSOR');
  const isFacilitator = set.has('FACILITATOR');
  const isAdmin = set.has('ADMIN');

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

@Injectable()
export class GatewayAuthService {
  private readonly usersById = new Map<string, StoredGatewayUser>();
  private readonly userIdByEmail = new Map<string, string>();
  private readonly refreshByHash = new Map<string, StoredRefreshSession>();
  private readonly jwtSecret =
    process.env.JWT_SECRET ?? 'vivu-dev-only-jwt-secret-key-change-in-prod';
  private readonly jwtIssuer =
    process.env.JWT_ISSUER ?? 'student-support-platform';
  private readonly jwtAudience =
    process.env.JWT_AUDIENCE ?? 'student-support-web';

  constructor() {
    this.seedUsers();
  }

  registerStudent(input: {
    email?: string;
    password?: string;
    role?: unknown;
    roles?: unknown;
  }): AuthSessionResponse {
    if (input.role !== undefined || input.roles !== undefined) {
      throw new BadRequestException({
        code: 'ROLE_SELECTION_NOT_ALLOWED',
        message:
          'El autoregistro está habilitado únicamente para estudiantes y no permite seleccionar rol.',
      });
    }

    const email = (input.email ?? '').trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      throw new BadRequestException({
        code: 'INVALID_EMAIL',
        message: 'Ingresa un correo electrónico válido.',
      });
    }

    const password = input.password ?? '';
    if (password.length < 8) {
      throw new BadRequestException({
        code: 'WEAK_PASSWORD',
        message: 'La contraseña debe tener al menos 8 caracteres.',
      });
    }

    if (this.userIdByEmail.has(email)) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'Ya existe una cuenta registrada con este correo.',
      });
    }

    const user: StoredGatewayUser = {
      id: randomUUID(),
      email,
      passwordHash: this.hashPassword(password),
      roles: ['STUDENT'],
      status: 'active',
    };

    this.usersById.set(user.id, user);
    this.userIdByEmail.set(email, user.id);

    return this.createSession(user);
  }

  login(input: { email?: string; password?: string }): AuthSessionResponse {
    const email = (input.email ?? '').trim().toLowerCase();
    const password = input.password ?? '';
    const userId = this.userIdByEmail.get(email);
    const user = userId ? this.usersById.get(userId) : undefined;

    if (!user || !this.verifyPassword(password, user.passwordHash)) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Correo o contraseña incorrectos.',
      });
    }

    this.ensureActive(user);
    return this.createSession(user);
  }

  refresh(refreshToken?: string): AuthSessionResponse {
    const raw = (refreshToken ?? '').trim();
    if (!raw) {
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'El refresh token es obligatorio.',
      });
    }

    const hash = this.hashRefreshToken(raw);
    const session = this.refreshByHash.get(hash);
    if (!session) {
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'La sesión de actualización no es válida.',
      });
    }

    const nowIso = new Date().toISOString();
    if (session.revokedAt) {
      for (const [k, item] of this.refreshByHash.entries()) {
        if (item.familyId === session.familyId && !item.revokedAt) {
          this.refreshByHash.set(k, { ...item, revokedAt: nowIso });
        }
      }
      throw new UnauthorizedException({
        code: 'REFRESH_TOKEN_REUSED',
        message:
          'Se detectó un token de actualización ya utilizado. Inicia sesión nuevamente.',
      });
    }

    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      this.refreshByHash.set(hash, { ...session, revokedAt: nowIso });
      throw new UnauthorizedException({
        code: 'REFRESH_TOKEN_EXPIRED',
        message: 'La sesión expiró. Inicia sesión nuevamente.',
      });
    }

    const user = this.usersById.get(session.userId);
    if (!user) {
      throw new UnauthorizedException({
        code: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado.',
      });
    }

    this.ensureActive(user);
    this.refreshByHash.set(hash, { ...session, revokedAt: nowIso });
    return this.createSession(user, session.familyId);
  }

  logout(refreshToken?: string): { revoked: boolean } {
    if (refreshToken) {
      const hash = this.hashRefreshToken(refreshToken.trim());
      const existing = this.refreshByHash.get(hash);
      if (existing && !existing.revokedAt) {
        this.refreshByHash.set(hash, {
          ...existing,
          revokedAt: new Date().toISOString(),
        });
      }
    }
    return { revoked: true };
  }

  verifyAccessToken(token: string): JwtAccessClaims {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException({
        code: 'INVALID_ACCESS_TOKEN',
        message: 'El token de acceso no tiene un formato válido.',
      });
    }

    const [headerPart, payloadPart, signaturePart] = parts;
    if (!headerPart || !payloadPart || !signaturePart) {
      throw new UnauthorizedException({
        code: 'INVALID_ACCESS_TOKEN',
        message: 'El token de acceso está incompleto.',
      });
    }

    const expectedSig = this.sign(`${headerPart}.${payloadPart}`);
    const actualBuf = Buffer.from(signaturePart, 'utf8');
    const expectedBuf = Buffer.from(expectedSig, 'utf8');

    if (
      actualBuf.length !== expectedBuf.length ||
      !timingSafeEqual(actualBuf, expectedBuf)
    ) {
      throw new UnauthorizedException({
        code: 'INVALID_ACCESS_TOKEN',
        message: 'La firma del token de acceso no es válida.',
      });
    }

    let claims: JwtAccessClaims;
    try {
      claims = JSON.parse(base64UrlDecode(payloadPart)) as JwtAccessClaims;
    } catch {
      throw new UnauthorizedException({
        code: 'INVALID_ACCESS_TOKEN',
        message: 'No fue posible leer las claims del token.',
      });
    }

    if (claims.iss !== this.jwtIssuer || claims.aud !== this.jwtAudience) {
      throw new UnauthorizedException({
        code: 'INVALID_TOKEN_CLAIMS',
        message: 'El emisor o audiencia del token no coinciden.',
      });
    }

    const nowEpoch = Math.floor(Date.now() / 1000);
    if (claims.exp <= nowEpoch) {
      throw new UnauthorizedException({
        code: 'TOKEN_EXPIRED',
        message: 'La sesión expiró. Inicia sesión nuevamente.',
      });
    }

    return claims;
  }

  getMe(userId: string): SessionUserDto {
    const user = this.usersById.get(userId);
    if (!user) {
      throw new UnauthorizedException({
        code: 'USER_NOT_FOUND',
        message: 'Usuario de sesión no encontrado.',
      });
    }
    this.ensureActive(user);
    return this.toUserDto(user);
  }

  private seedUsers(): void {
    const defaultHash = this.hashPassword(DEFAULT_GATEWAY_SEED_PASSWORD);
    const seeds: StoredGatewayUser[] = [
      {
        id: '00000000-0000-4000-8000-000000000001',
        email: 'admin.piloto@vivu.local',
        passwordHash: defaultHash,
        roles: ['ADMIN'],
        status: 'active',
      },
      {
        id: '00000000-0000-4000-8000-000000000002',
        email: 'facilitador.ingenieria@vivu.local',
        passwordHash: defaultHash,
        roles: ['FACILITATOR'],
        status: 'active',
      },
      {
        id: '00000000-0000-4000-8000-000000000003',
        email: 'facilitador.bienestar@vivu.local',
        passwordHash: defaultHash,
        roles: ['FACILITATOR'],
        status: 'active',
      },
      {
        id: '00000000-0000-4000-8000-000000000004',
        email: 'est.activo@vivu.local',
        passwordHash: defaultHash,
        roles: ['STUDENT'],
        status: 'active',
      },
      {
        id: '00000000-0000-4000-8000-000000000005',
        email: 'est.recuperacion@vivu.local',
        passwordHash: defaultHash,
        roles: ['STUDENT'],
        status: 'active',
      },
      {
        id: '00000000-0000-4000-8000-000000000006',
        email: 'est.nuevo@vivu.local',
        passwordHash: defaultHash,
        roles: ['STUDENT'],
        status: 'active',
      },
      {
        id: '00000000-0000-4000-8000-000000000007',
        email: 'est.deshabilitado@vivu.local',
        passwordHash: defaultHash,
        roles: ['STUDENT'],
        status: 'disabled',
      },
      {
        id: '00000000-0000-4000-8000-000000000008',
        email: 'profesor.ingenieria@vivu.local',
        passwordHash: defaultHash,
        roles: ['PROFESSOR'],
        status: 'active',
      },
    ];

    for (const seed of seeds) {
      this.usersById.set(seed.id, seed);
      this.userIdByEmail.set(seed.email, seed.id);
    }
  }

  private ensureActive(user: StoredGatewayUser): void {
    if (user.status !== 'active') {
      throw new ForbiddenException({
        code: 'USER_DISABLED',
        message:
          'Esta cuenta no se encuentra activa actualmente. Contacta a la coordinación del piloto.',
      });
    }
  }

  private createSession(
    user: StoredGatewayUser,
    familyId: string = randomUUID(),
  ): AuthSessionResponse {
    const nowEpoch = Math.floor(Date.now() / 1000);
    const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const claims: JwtAccessClaims = {
      sub: user.id,
      roles: [...user.roles],
      iss: this.jwtIssuer,
      aud: this.jwtAudience,
      iat: nowEpoch,
      exp: nowEpoch + ACCESS_TTL_SECONDS,
      jti: randomUUID(),
    };
    const payload = base64UrlEncode(JSON.stringify(claims));
    const accessToken = `${header}.${payload}.${this.sign(`${header}.${payload}`)}`;

    const refreshToken = `vivu_rt_${randomUUID()}_${randomUUID()}`;
    const tokenHash = this.hashRefreshToken(refreshToken);

    this.refreshByHash.set(tokenHash, {
      id: randomUUID(),
      familyId,
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS).toISOString(),
    });

    return {
      accessToken,
      refreshToken,
      expiresInSeconds: ACCESS_TTL_SECONDS,
      offlineAccessWindowSeconds: user.roles.includes('STUDENT')
        ? OFFLINE_ACCESS_WINDOW_SECONDS
        : 0,
      user: this.toUserDto(user),
    };
  }

  private toUserDto(user: StoredGatewayUser): SessionUserDto {
    return {
      userId: user.id,
      email: user.email,
      roles: [...user.roles],
      status: user.status,
      capabilities: buildCapabilities(user.roles),
    };
  }

  private hashPassword(plain: string): string {
    const salt = randomBytes(16).toString('hex');
    const derived = scryptSync(plain, salt, KEY_LENGTH).toString('hex');
    return `scrypt$${salt}$${derived}`;
  }

  private verifyPassword(plain: string, stored: string): boolean {
    const parts = stored.split('$');
    if (parts.length !== 3 || parts[0] !== 'scrypt') {
      return false;
    }
    const [, salt, keyHex] = parts;
    if (!salt || !keyHex) {
      return false;
    }
    const expected = Buffer.from(keyHex, 'hex');
    const actual = scryptSync(plain, salt, KEY_LENGTH);
    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  }

  private hashRefreshToken(raw: string): string {
    return createHash('sha256').update(raw, 'utf8').digest('hex');
  }

  private sign(input: string): string {
    return createHmac('sha256', this.jwtSecret)
      .update(input, 'utf8')
      .digest('base64url');
  }
}

