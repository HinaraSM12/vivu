import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthSessionResponse, SessionUserDto } from './auth.types';

function extractBearerToken(authorizationHeader?: string): string {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException({
      code: 'MISSING_BEARER_TOKEN',
      message: 'Se requiere autenticación mediante Bearer token.',
    });
  }
  return authorizationHeader.slice('Bearer '.length).trim();
}

@Controller()
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('auth/register')
  register(
    @Body()
    body: {
      email?: string;
      password?: string;
      role?: unknown;
      roles?: unknown;
    },
    @Headers('x-correlation-id') correlationId?: string,
  ): AuthSessionResponse {
    return this.authService.registerStudent({
      email: body.email ?? '',
      password: body.password ?? '',
      role: body.role,
      roles: body.roles,
      correlationId,
    });
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() body: { email?: string; password?: string },
  ): AuthSessionResponse {
    return this.authService.login({
      email: body.email ?? '',
      password: body.password ?? '',
    });
  }

  @Post('auth/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() body: { refreshToken?: string }): AuthSessionResponse {
    return this.authService.refresh({
      refreshToken: body.refreshToken ?? '',
    });
  }

  @Post('auth/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() body: { refreshToken?: string }): { revoked: boolean } {
    return this.authService.logout(body.refreshToken);
  }

  @Get('me')
  getMe(@Headers('authorization') authorization?: string): SessionUserDto {
    const token = extractBearerToken(authorization);
    return this.authService.getMeFromAccessToken(token);
  }
}

