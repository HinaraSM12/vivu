import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  DEFAULT_SEED_PASSWORD,
  IdentityRepository,
} from './identity.repository';
import { PasswordHasher } from './password-hasher';
import { TokenService } from './token.service';

describe('AuthService (Sprint 1 — Identity & Access)', () => {
  let authService: AuthService;
  let tokenService: TokenService;

  beforeEach(() => {
    const hasher = new PasswordHasher();
    const repository = new IdentityRepository(hasher);
    tokenService = new TokenService();
    authService = new AuthService(repository, hasher, tokenService);
  });

  it('registra un estudiante nuevo asignando únicamente el rol STUDENT y emitiendo user.registered.v1 sin PII', () => {
    const session = authService.registerStudent({
      email: 'nuevo.ing@vivu.local',
      password: 'PasswordSeguro#123',
      correlationId: 'corr-register-1',
    });

    expect(session.user.email).toBe('nuevo.ing@vivu.local');
    expect(session.user.roles).toEqual(['STUDENT']);
    expect(session.user.capabilities.canOperateOffline).toBe(true);
    expect(session.user.capabilities.canManageCatalogsAndRulesOnline).toBe(
      false,
    );
    expect(session.offlineAccessWindowSeconds).toBeGreaterThan(0);

    const events = authService.getRecordedDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventType).toBe('user.registered.v1');
    expect(events[0]?.schemaVersion).toBe(1);
    expect(events[0]?.payload).toEqual({ userRole: 'STUDENT' });
    expect(JSON.stringify(events[0])).not.toContain('nuevo.ing@vivu.local');
    expect(JSON.stringify(events[0])).not.toContain('PasswordSeguro#123');
  });

  it('rechaza cualquier intento de enviar rol explícito (FACILITATOR o ADMIN) en autoregistro', () => {
    expect(() =>
      authService.registerStudent({
        email: 'intento.admin@vivu.local',
        password: 'PasswordSeguro#123',
        role: 'ADMIN',
      }),
    ).toThrow(BadRequestException);

    expect(() =>
      authService.registerStudent({
        email: 'intento.fac@vivu.local',
        password: 'PasswordSeguro#123',
        roles: ['FACILITATOR'],
      }),
    ).toThrow(BadRequestException);
  });

  it('impide registrar dos cuentas con el mismo correo', () => {
    authService.registerStudent({
      email: 'duplicado@vivu.local',
      password: 'PasswordSeguro#123',
    });

    expect(() =>
      authService.registerStudent({
        email: 'DUPLICADO@vivu.local',
        password: 'PasswordSeguro#123',
      }),
    ).toThrow(ConflictException);
  });

  it('permite login de usuarios seed STUDENT, FACILITATOR y ADMIN con sus capacidades respectivas', () => {
    const adminSession = authService.login({
      email: 'admin.piloto@vivu.local',
      password: DEFAULT_SEED_PASSWORD,
    });
    expect(adminSession.user.roles).toEqual(['ADMIN']);
    expect(adminSession.user.capabilities.canManageCatalogsAndRulesOnline).toBe(
      true,
    );
    expect(adminSession.offlineAccessWindowSeconds).toBe(0);

    const facilitatorSession = authService.login({
      email: 'facilitador.ingenieria@vivu.local',
      password: DEFAULT_SEED_PASSWORD,
    });
    expect(facilitatorSession.user.roles).toEqual(['FACILITATOR']);
    expect(facilitatorSession.user.capabilities.canViewAssignedStudents).toBe(
      true,
    );
    expect(facilitatorSession.offlineAccessWindowSeconds).toBe(0);

    const studentSession = authService.login({
      email: 'est.activo@vivu.local',
      password: DEFAULT_SEED_PASSWORD,
    });
    expect(studentSession.user.roles).toEqual(['STUDENT']);
    expect(studentSession.user.capabilities.canCompleteMissions).toBe(true);
  });

  it('rechaza credenciales incorrectas y cuentas deshabilitadas', () => {
    expect(() =>
      authService.login({
        email: 'est.activo@vivu.local',
        password: 'wrong-password',
      }),
    ).toThrow(UnauthorizedException);

    expect(() =>
      authService.login({
        email: 'est.deshabilitado@vivu.local',
        password: DEFAULT_SEED_PASSWORD,
      }),
    ).toThrow(ForbiddenException);
  });

  it('rota el refresh token y revoca toda la familia si se detecta reutilización de un token ya rotado', () => {
    const initial = authService.login({
      email: 'est.activo@vivu.local',
      password: DEFAULT_SEED_PASSWORD,
    });

    const rotated = authService.refresh({
      refreshToken: initial.refreshToken,
    });
    expect(rotated.refreshToken).not.toBe(initial.refreshToken);

    // Reutilizar el refresh token inicial debe fallar y revocar la familia entera
    expect(() =>
      authService.refresh({
        refreshToken: initial.refreshToken,
      }),
    ).toThrow(UnauthorizedException);

    // El segundo token de la misma familia también queda invalidado tras el intento de reuso
    expect(() =>
      authService.refresh({
        refreshToken: rotated.refreshToken,
      }),
    ).toThrow(UnauthorizedException);
  });

  it('revoca la sesión al hacer logout', () => {
    const session = authService.login({
      email: 'est.activo@vivu.local',
      password: DEFAULT_SEED_PASSWORD,
    });

    const result = authService.logout(session.refreshToken);
    expect(result.revoked).toBe(true);

    expect(() =>
      authService.refresh({ refreshToken: session.refreshToken }),
    ).toThrow(UnauthorizedException);
  });
});

