import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  type AuthSessionResponse,
  GatewayAuthService,
  type SessionUserDto,
} from './gateway-auth.service';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
  RequireRoles,
  RolesGuard,
} from './rbac.guards';

@Controller()
export class AuthGatewayController {
  constructor(
    @Inject(GatewayAuthService)
    private readonly authService: GatewayAuthService,
  ) {}

  @Post('auth/register')
  register(
    @Body()
    body: {
      email?: string;
      password?: string;
      role?: unknown;
      roles?: unknown;
    },
  ): AuthSessionResponse {
    return this.authService.registerStudent(body);
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() body: { email?: string; password?: string },
  ): AuthSessionResponse {
    return this.authService.login(body);
  }

  @Post('auth/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() body: { refreshToken?: string }): AuthSessionResponse {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('auth/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  logout(@Body() body: { refreshToken?: string }): { revoked: boolean } {
    return this.authService.logout(body.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() request: AuthenticatedRequest): SessionUserDto {
    const userId = request.authClaims?.sub ?? '';
    return this.authService.getMe(userId);
  }

  @Get('student/access-check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('STUDENT')
  checkStudentAccess(@Req() request: AuthenticatedRequest): {
    allowed: boolean;
    roleScope: 'STUDENT';
    userId: string;
  } {
    return {
      allowed: true,
      roleScope: 'STUDENT',
      userId: request.authClaims?.sub ?? '',
    };
  }

  @Get('facilitator/access-check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('FACILITATOR', 'ADMIN')
  checkFacilitatorAccess(@Req() request: AuthenticatedRequest): {
    allowed: boolean;
    roleScope: 'FACILITATOR';
    userId: string;
  } {
    return {
      allowed: true,
      roleScope: 'FACILITATOR',
      userId: request.authClaims?.sub ?? '',
    };
  }

  @Get('admin/access-check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('ADMIN')
  checkAdminAccess(@Req() request: AuthenticatedRequest): {
    allowed: boolean;
    roleScope: 'ADMIN';
    userId: string;
  } {
    return {
      allowed: true,
      roleScope: 'ADMIN',
      userId: request.authClaims?.sub ?? '',
    };
  }
}

