import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';

const KEY_LENGTH = 64;

@Injectable()
export class PasswordHasher {
  hash(plainPassword: string): string {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(plainPassword, salt, KEY_LENGTH).toString(
      'hex',
    );
    return `scrypt$${salt}$${derivedKey}`;
  }

  verify(plainPassword: string, storedHash: string): boolean {
    const parts = storedHash.split('$');
    if (parts.length !== 3 || parts[0] !== 'scrypt') {
      return false;
    }

    const [, salt, keyHex] = parts;
    if (!salt || !keyHex) {
      return false;
    }

    const expectedBuffer = Buffer.from(keyHex, 'hex');
    const actualBuffer = scryptSync(plainPassword, salt, KEY_LENGTH);

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, actualBuffer);
  }
}

