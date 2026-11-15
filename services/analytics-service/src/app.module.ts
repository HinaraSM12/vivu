import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CorrelationIdMiddleware } from './common/correlation-id.middleware';
import { validateEnvironment } from './config/environment.validation';
import { HealthController } from './health/health.controller';
import { AnalyticsController } from './analytics/analytics.controller';
import { AnalyticsRepository } from './analytics/analytics.repository';
import { AnalyticsService } from './analytics/analytics.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
  ],
  controllers: [HealthController, AnalyticsController],
  providers: [AnalyticsRepository, AnalyticsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
