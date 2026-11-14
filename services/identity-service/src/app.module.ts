import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { IdentityRepository } from './auth/identity.repository';
import { PasswordHasher } from './auth/password-hasher';
import { TokenService } from './auth/token.service';
import { CorrelationIdMiddleware } from './common/correlation-id.middleware';
import { validateEnvironment } from './config/environment.validation';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
  ],
  controllers: [HealthController, AuthController],
  providers: [PasswordHasher, TokenService, IdentityRepository, AuthService],
  exports: [AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
