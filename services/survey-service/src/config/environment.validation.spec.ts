import { validateEnvironment } from './environment.validation';

describe('validateEnvironment', () => {
  it('rejects an invalid database URL', () => {
    expect(() =>
      validateEnvironment({ DATABASE_URL: 'not a valid url' }),
    ).toThrow('DATABASE_URL debe ser una URL válida.');
  });

  it('provides the service default port', () => {
    expect(validateEnvironment({}).PORT).toBe(3005);
  });
});
