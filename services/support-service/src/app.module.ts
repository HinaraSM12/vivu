import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CorrelationIdMiddleware } from './common/correlation-id.middleware';
import { validateEnvironment } from './config/environment.validation';
import { HealthController } from './health/health.controller';
import { SupportController } from './support/support.controller';
import { SupportRepository } from './support/support.repository';
import { SupportService } from './support/support.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
  ],
  controllers: [HealthController, SupportController],
  providers: [SupportRepository, SupportService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
