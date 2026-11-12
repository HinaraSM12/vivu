import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthGatewayController } from './auth/auth-gateway.controller';
import { GatewayAuthService } from './auth/gateway-auth.service';
import { JwtAuthGuard, RolesGuard } from './auth/rbac.guards';
import { validateEnvironment } from './common/config/environment.validation';
import { CorrelationIdMiddleware } from './common/correlation-id.middleware';
import { StandardErrorFilter } from './common/filters/standard-error.filter';
import { GamificationGatewayController } from './gamification/gamification-gateway.controller';
import { GatewayGamificationService } from './gamification/gateway-gamification.service';
import { HealthController } from './health/health.controller';
import { GatewayStudentService } from './student/gateway-student.service';
import { StudentGatewayController } from './student/student-gateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
  ],
  controllers: [
    HealthController,
    AuthGatewayController,
    StudentGatewayController,
    GamificationGatewayController,
  ],
  providers: [
    GatewayAuthService,
    GatewayStudentService,
    GatewayGamificationService,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: APP_FILTER,
      useClass: StandardErrorFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
