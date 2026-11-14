import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CorrelationIdMiddleware } from './common/correlation-id.middleware';
import { validateEnvironment } from './config/environment.validation';
import { HealthController } from './health/health.controller';
import { SurveyController } from './survey/survey.controller';
import { SurveyRepository } from './survey/survey.repository';
import { SurveyService } from './survey/survey.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
  ],
  controllers: [HealthController, SurveyController],
  providers: [SurveyRepository, SurveyService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
