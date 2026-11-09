import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import {
  GatewayAuthService,
  type JwtAccessClaims,
  type RoleCode,
} from './gateway-auth.service';

export const ROLES_METADATA_KEY = 'vivu_required_roles';
export const RequireRoles = (...roles: RoleCode[]) =>
  SetMetadata(ROLES_METADATA_KEY, roles);

export interface AuthenticatedRequest extends Request {
  authClaims?: JwtAccessClaims;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(GatewayAuthService)
    private readonly authService: GatewayAuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        code: 'MISSING_BEARER_TOKEN',
        message: 'Se requiere iniciar sesión para acceder a este recurso.',
      });
    }

    const token = authHeader.slice('Bearer '.length).trim();
    request.authClaims = this.authService.verifyAccessToken(token);
    return true;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      RoleCode[] | undefined
    >(ROLES_METADATA_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userRoles = request.authClaims?.roles ?? [];

    const hasAllowedRole = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!hasAllowedRole) {
      throw new ForbiddenException({
        code: 'FORBIDDEN_ROLE',
        message: 'No tienes permisos para acceder a esta sección.',
      });
    }

    return true;
  }
}

