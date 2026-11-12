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
import { GatewayRecommendationService } from './recommendation/gateway-recommendation.service';
import { RecommendationGatewayController } from './recommendation/recommendation-gateway.controller';
import { GatewayResourceService } from './resource/gateway-resource.service';
import { ResourceGatewayController } from './resource/resource-gateway.controller';
import { GatewayStudentService } from './student/gateway-student.service';
import { StudentGatewayController } from './student/student-gateway.controller';
import { GatewaySurveyService } from './survey/gateway-survey.service';
import { SurveyGatewayController } from './survey/survey-gateway.controller';

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
    ResourceGatewayController,
    SurveyGatewayController,
    RecommendationGatewayController,
  ],
  providers: [
    GatewayAuthService,
    GatewayStudentService,
    GatewayGamificationService,
    GatewayResourceService,
    GatewaySurveyService,
    GatewayRecommendationService,
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
