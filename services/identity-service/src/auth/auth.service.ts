import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  type AuthSessionResponse,
  buildSessionCapabilities,
  type DomainEventRecord,
  type JwtAccessClaims,
  type SessionUserDto,
  type UserEntity,
} from './auth.types';
import { IdentityRepository } from './identity.repository';
import { PasswordHasher } from './password-hasher';
import { TokenService } from './token.service';

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const OFFLINE_ACCESS_WINDOW_SECONDS = 72 * 60 * 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegisterStudentInput {
  email: string;
  password: string;
  role?: unknown;
  roles?: unknown;
  correlationId?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(IdentityRepository)
    private readonly repository: IdentityRepository,
    @Inject(PasswordHasher) private readonly passwordHasher: PasswordHasher,
    @Inject(TokenService) private readonly tokenService: TokenService,
  ) {}

  registerStudent(input: RegisterStudentInput): AuthSessionResponse {
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

    if (this.repository.findUserByEmail(email)) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'Ya existe una cuenta registrada con este correo.',
      });
    }

    const nowIso = new Date().toISOString();
    const user: UserEntity = {
      id: randomUUID(),
      email,
      passwordHash: this.passwordHasher.hash(password),
      roles: ['STUDENT'],
      status: 'active',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    this.repository.saveUser(user);

    const registeredEvent: DomainEventRecord = {
      eventId: randomUUID(),
      eventType: 'user.registered.v1',
      occurredAt: nowIso,
      actorId: user.id,
      subjectId: user.id,
      correlationId: input.correlationId ?? randomUUID(),
      schemaVersion: 1,
      payload: {
        userRole: 'STUDENT',
      },
    };
    this.repository.appendDomainEvent(registeredEvent);

    return this.createSessionForUser(user);
  }

  login(input: LoginInput): AuthSessionResponse {
    const email = (input.email ?? '').trim().toLowerCase();
    const password = input.password ?? '';

    const user = this.repository.findUserByEmail(email);
    if (!user || !this.passwordHasher.verify(password, user.passwordHash)) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Correo o contraseña incorrectos.',
      });
    }

    this.assertUserIsActive(user);

    return this.createSessionForUser(user);
  }

  refresh(input: RefreshTokenInput): AuthSessionResponse {
    const rawToken = (input.refreshToken ?? '').trim();
    if (!rawToken) {
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'El refresh token es obligatorio.',
      });
    }

    const tokenHash = this.tokenService.hashRefreshToken(rawToken);
    const session = this.repository.findRefreshSessionByTokenHash(tokenHash);
    if (!session) {
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'La sesión de actualización no es válida.',
      });
    }

    const nowIso = new Date().toISOString();
    if (session.revokedAt) {
      this.repository.revokeRefreshSessionFamily(session.familyId, nowIso);
      throw new UnauthorizedException({
        code: 'REFRESH_TOKEN_REUSED',
        message:
          'Se detectó un token de actualización ya utilizado. Por seguridad, inicia sesión nuevamente.',
      });
    }

    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      this.repository.revokeRefreshSessionByTokenHash(tokenHash, nowIso);
      throw new UnauthorizedException({
        code: 'REFRESH_TOKEN_EXPIRED',
        message: 'La sesión expiró. Inicia sesión nuevamente.',
      });
    }

    const user = this.repository.findUserById(session.userId);
    if (!user) {
      throw new UnauthorizedException({
        code: 'USER_NOT_FOUND',
        message: 'No se encontró la cuenta asociada a la sesión.',
      });
    }

    this.assertUserIsActive(user);

    this.repository.revokeRefreshSessionByTokenHash(tokenHash, nowIso);
    return this.createSessionForUser(user, session.familyId, session.id);
  }

  logout(refreshToken?: string): { revoked: boolean } {
    if (!refreshToken) {
      return { revoked: true };
    }

    const tokenHash = this.tokenService.hashRefreshToken(refreshToken.trim());
    this.repository.revokeRefreshSessionByTokenHash(
      tokenHash,
      new Date().toISOString(),
    );
    return { revoked: true };
  }

  getMeFromAccessToken(accessToken: string): SessionUserDto {
    const claims = this.verifyAccessToken(accessToken);
    const user = this.repository.findUserById(claims.sub);
    if (!user) {
      throw new UnauthorizedException({
        code: 'USER_NOT_FOUND',
        message: 'Usuario de sesión no encontrado.',
      });
    }

    this.assertUserIsActive(user);
    return this.toSessionUserDto(user);
  }

  verifyAccessToken(accessToken: string): JwtAccessClaims {
    return this.tokenService.verifyAccessToken(accessToken);
  }

  getRecordedDomainEvents(): readonly DomainEventRecord[] {
    return this.repository.getDomainEvents();
  }

  private assertUserIsActive(user: UserEntity): void {
    if (user.status !== 'active') {
      throw new ForbiddenException({
        code: 'USER_DISABLED',
        message:
          'Esta cuenta no se encuentra activa actualmente. Contacta a la coordinación del piloto.',
      });
    }
  }

  private createSessionForUser(
    user: UserEntity,
    familyId: string = randomUUID(),
    rotatedFromId?: string,
  ): AuthSessionResponse {
    const accessToken = this.tokenService.issueAccessToken(user.id, user.roles);
    const { rawToken, tokenHash } = this.tokenService.generateRefreshToken();
    const now = Date.now();

    this.repository.saveRefreshSession({
      id: randomUUID(),
      familyId,
      userId: user.id,
      tokenHash,
      expiresAt: new Date(now + REFRESH_TTL_MS).toISOString(),
      rotatedFromId,
      createdAt: new Date(now).toISOString(),
    });

    return {
      accessToken,
      refreshToken: rawToken,
      expiresInSeconds: this.tokenService.getAccessTokenTtlSeconds(),
      offlineAccessWindowSeconds: user.roles.includes('STUDENT')
        ? OFFLINE_ACCESS_WINDOW_SECONDS
        : 0,
      user: this.toSessionUserDto(user),
    };
  }

  private toSessionUserDto(user: UserEntity): SessionUserDto {
    return {
      userId: user.id,
      email: user.email,
      roles: [...user.roles],
      status: user.status,
      capabilities: buildSessionCapabilities(user.roles),
    };
  }
}

