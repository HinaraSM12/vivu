import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import {
  StudentContextService,
  type UpdateProfilePayload,
} from './student-context.service';
import type {
  ConsentRecordEntity,
  PersonalizationPreferencesEntity,
  PreferredTone,
  StudentProfileResponseDto,
} from './student.types';

function requireStudentIdHeader(studentIdHeader?: string): string {
  const id = (studentIdHeader ?? '').trim();
  if (!id) {
    throw new UnauthorizedException({
      code: 'MISSING_STUDENT_CONTEXT',
      message: 'Se requiere identificador autenticado del estudiante.',
    });
  }
  return id;
}

@Controller()
export class StudentController {
  constructor(
    @Inject(StudentContextService)
    private readonly studentService: StudentContextService,
  ) {}

  @Get('me/consent')
  getConsent(
    @Headers('x-student-id') studentIdHeader?: string,
  ): ConsentRecordEntity {
    const studentId = requireStudentIdHeader(studentIdHeader);
    return this.studentService.getConsent(studentId);
  }

  @Post('me/consent')
  @HttpCode(HttpStatus.OK)
  acceptConsent(
    @Headers('x-student-id') studentIdHeader?: string,
    @Headers('x-correlation-id') correlationId?: string,
    @Body()
    body?: {
      consentVersion?: string;
      allowPersonalization?: boolean;
      allowOptionalWellbeingContext?: boolean;
      preferredTone?: PreferredTone;
    },
  ): {
    consent: ConsentRecordEntity;
    preferences: PersonalizationPreferencesEntity;
  } {
    const studentId = requireStudentIdHeader(studentIdHeader);
    return this.studentService.acceptConsent({
      studentId,
      consentVersion: body?.consentVersion,
      allowPersonalization: body?.allowPersonalization,
      allowOptionalWellbeingContext: body?.allowOptionalWellbeingContext,
      preferredTone: body?.preferredTone,
      correlationId,
    });
  }

  @Post('me/consent/withdraw')
  @HttpCode(HttpStatus.OK)
  withdrawConsent(
    @Headers('x-student-id') studentIdHeader?: string,
    @Headers('x-correlation-id') correlationId?: string,
  ): {
    consent: ConsentRecordEntity;
    preferences: PersonalizationPreferencesEntity;
  } {
    const studentId = requireStudentIdHeader(studentIdHeader);
    return this.studentService.withdrawConsent(studentId, correlationId);
  }

  @Get('me/profile')
  getProfile(
    @Headers('x-student-id') studentIdHeader?: string,
  ): StudentProfileResponseDto {
    const studentId = requireStudentIdHeader(studentIdHeader);
    return this.studentService.getProfile(studentId);
  }

  @Put('me/profile')
  updateProfile(
    @Headers('x-student-id') studentIdHeader?: string,
    @Headers('x-correlation-id') correlationId?: string,
    @Body() body?: UpdateProfilePayload,
  ): StudentProfileResponseDto {
    const studentId = requireStudentIdHeader(studentIdHeader);
    return this.studentService.updateProfile(
      studentId,
      body ?? {},
      correlationId,
    );
  }

  @Get('me/personalization-preferences')
  getPreferences(
    @Headers('x-student-id') studentIdHeader?: string,
  ): PersonalizationPreferencesEntity {
    const studentId = requireStudentIdHeader(studentIdHeader);
    return this.studentService.getPreferences(studentId);
  }

  @Put('me/personalization-preferences')
  updatePreferences(
    @Headers('x-student-id') studentIdHeader?: string,
    @Body()
    body?: {
      allowPersonalization?: boolean;
      allowOptionalWellbeingContext?: boolean;
      preferredTone?: PreferredTone;
    },
  ): PersonalizationPreferencesEntity {
    const studentId = requireStudentIdHeader(studentIdHeader);
    return this.studentService.updatePreferences(studentId, body ?? {});
  }
}

