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
import { GatewayJsonSnapshotStore } from './common/persistence/json-snapshot.store';
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
import { GatewaySyncService } from './sync/gateway-sync.service';
import { SyncGatewayController } from './sync/sync-gateway.controller';
import { FacilitatorGatewayController } from './facilitator/facilitator-gateway.controller';
import { GatewayFacilitatorService } from './facilitator/gateway-facilitator.service';
import { AdminGatewayController } from './admin/admin-gateway.controller';
import { GatewayAdminService } from './admin/gateway-admin.service';
import { AnalyticsGatewayController } from './analytics/analytics-gateway.controller';
import { GatewayAnalyticsService } from './analytics/gateway-analytics.service';

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
    SyncGatewayController,
    FacilitatorGatewayController,
    AdminGatewayController,
    AnalyticsGatewayController,
  ],
  providers: [
    GatewayJsonSnapshotStore,
    GatewayAuthService,
    GatewayStudentService,
    GatewayGamificationService,
    GatewayResourceService,
    GatewaySurveyService,
    GatewayRecommendationService,
    GatewaySyncService,
    GatewayFacilitatorService,
    GatewayAdminService,
    GatewayAnalyticsService,
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
