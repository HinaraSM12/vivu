import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { JwtAccessClaims, RoleCode } from './auth.types';

const DEFAULT_ISSUER = 'student-support-platform';
const DEFAULT_AUDIENCE = 'student-support-web';
const DEFAULT_ACCESS_TTL_SECONDS = 900;

function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8');
}

@Injectable()
export class TokenService {
  private readonly secret: string;
  private readonly issuer: string;
  private readonly audience: string;
  private readonly accessTtlSeconds: number;

  constructor() {
    this.secret =
      process.env.JWT_SECRET ?? 'vivu-dev-only-jwt-secret-key-change-in-prod';
    this.issuer = process.env.JWT_ISSUER ?? DEFAULT_ISSUER;
    this.audience = process.env.JWT_AUDIENCE ?? DEFAULT_AUDIENCE;
    this.accessTtlSeconds = DEFAULT_ACCESS_TTL_SECONDS;
  }

  getAccessTokenTtlSeconds(): number {
    return this.accessTtlSeconds;
  }

  issueAccessToken(
    userId: string,
    roles: RoleCode[],
    nowEpochSeconds = Math.floor(Date.now() / 1000),
  ): string {
    const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const claims: JwtAccessClaims = {
      sub: userId,
      roles,
      iss: this.issuer,
      aud: this.audience,
      iat: nowEpochSeconds,
      exp: nowEpochSeconds + this.accessTtlSeconds,
      jti: randomUUID(),
    };
    const payload = base64UrlEncode(JSON.stringify(claims));
    const signingInput = `${header}.${payload}`;
    const signature = this.sign(signingInput);
    return `${signingInput}.${signature}`;
  }

  verifyAccessToken(
    token: string,
    nowEpochSeconds = Math.floor(Date.now() / 1000),
  ): JwtAccessClaims {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException({
        code: 'INVALID_ACCESS_TOKEN',
        message: 'El token de acceso no tiene un formato válido.',
      });
    }

    const [headerPart, payloadPart, signaturePart] = parts;
    if (!headerPart || !payloadPart || !signaturePart) {
      throw new UnauthorizedException({
        code: 'INVALID_ACCESS_TOKEN',
        message: 'El token de acceso está incompleto.',
      });
    }

    const expectedSignature = this.sign(`${headerPart}.${payloadPart}`);
    const actualBuf = Buffer.from(signaturePart, 'utf8');
    const expectedBuf = Buffer.from(expectedSignature, 'utf8');

    if (
      actualBuf.length !== expectedBuf.length ||
      !timingSafeEqual(actualBuf, expectedBuf)
    ) {
      throw new UnauthorizedException({
        code: 'INVALID_ACCESS_TOKEN',
        message: 'La firma del token de acceso no es válida.',
      });
    }

    let claims: JwtAccessClaims;
    try {
      claims = JSON.parse(base64UrlDecode(payloadPart)) as JwtAccessClaims;
    } catch {
      throw new UnauthorizedException({
        code: 'INVALID_ACCESS_TOKEN',
        message: 'No fue posible leer las claims del token de acceso.',
      });
    }

    if (claims.iss !== this.issuer || claims.aud !== this.audience) {
      throw new UnauthorizedException({
        code: 'INVALID_TOKEN_CLAIMS',
        message: 'El emisor o audiencia del token no coinciden.',
      });
    }

    if (claims.exp <= nowEpochSeconds) {
      throw new UnauthorizedException({
        code: 'TOKEN_EXPIRED',
        message: 'La sesión expiró. Inicia sesión nuevamente.',
      });
    }

    return claims;
  }

  generateRefreshToken(): { rawToken: string; tokenHash: string } {
    const rawToken = `vivu_rt_${randomUUID()}_${randomUUID()}`;
    return {
      rawToken,
      tokenHash: this.hashRefreshToken(rawToken),
    };
  }

  hashRefreshToken(rawToken: string): string {
    return createHash('sha256').update(rawToken, 'utf8').digest('hex');
  }

  private sign(input: string): string {
    return createHmac('sha256', this.secret).update(input, 'utf8').digest('base64url');
  }
}

