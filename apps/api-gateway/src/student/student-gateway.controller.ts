import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
  RequireRoles,
  RolesGuard,
} from '../auth/rbac.guards';
import {
  type GatewayConsentRecord,
  type GatewayPersonalizationPreferences,
  type GatewayStudentProfile,
  GatewayStudentService,
  type PreferredTone,
} from './gateway-student.service';

@Controller('me')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireRoles('STUDENT')
export class StudentGatewayController {
  constructor(
    @Inject(GatewayStudentService)
    private readonly studentService: GatewayStudentService,
  ) {}

  @Get('consent')
  getConsent(@Req() request: AuthenticatedRequest): GatewayConsentRecord {
    const studentId = request.authClaims?.sub ?? '';
    return this.studentService.getConsent(studentId);
  }

  @Post('consent')
  @HttpCode(HttpStatus.OK)
  acceptConsent(
    @Req() request: AuthenticatedRequest,
    @Body()
    body?: {
      consentVersion?: string;
      allowPersonalization?: boolean;
      allowOptionalWellbeingContext?: boolean;
      preferredTone?: PreferredTone;
    },
  ): {
    consent: GatewayConsentRecord;
    preferences: GatewayPersonalizationPreferences;
  } {
    const studentId = request.authClaims?.sub ?? '';
    return this.studentService.acceptConsent(studentId, body);
  }

  @Post('consent/withdraw')
  @HttpCode(HttpStatus.OK)
  withdrawConsent(@Req() request: AuthenticatedRequest): {
    consent: GatewayConsentRecord;
    preferences: GatewayPersonalizationPreferences;
  } {
    const studentId = request.authClaims?.sub ?? '';
    return this.studentService.withdrawConsent(studentId);
  }

  @Get('profile')
  getProfile(@Req() request: AuthenticatedRequest): GatewayStudentProfile {
    const studentId = request.authClaims?.sub ?? '';
    return this.studentService.getProfile(studentId);
  }

  @Put('profile')
  updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() body?: Record<string, unknown>,
  ): GatewayStudentProfile {
    const studentId = request.authClaims?.sub ?? '';
    return this.studentService.updateProfile(studentId, body ?? {});
  }

  @Get('personalization-preferences')
  getPreferences(
    @Req() request: AuthenticatedRequest,
  ): GatewayPersonalizationPreferences {
    const studentId = request.authClaims?.sub ?? '';
    return this.studentService.getPreferences(studentId);
  }

  @Put('personalization-preferences')
  updatePreferences(
    @Req() request: AuthenticatedRequest,
    @Body()
    body?: {
      allowPersonalization?: boolean;
      allowOptionalWellbeingContext?: boolean;
      preferredTone?: PreferredTone;
    },
  ): GatewayPersonalizationPreferences {
    const studentId = request.authClaims?.sub ?? '';
    return this.studentService.updatePreferences(studentId, body);
  }
}

