import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CorrelationIdMiddleware } from './common/correlation-id.middleware';
import { validateEnvironment } from './config/environment.validation';
import { HealthController } from './health/health.controller';
import { StudentContextService } from './student/student-context.service';
import { StudentController } from './student/student.controller';
import { StudentRepository } from './student/student.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
  ],
  controllers: [HealthController, StudentController],
  providers: [StudentRepository, StudentContextService],
  exports: [StudentContextService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
