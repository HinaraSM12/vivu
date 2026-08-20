import { validateEnvironment } from './environment.validation';

describe('validateEnvironment', () => {
  it('rejects an invalid port', () => {
    expect(() => validateEnvironment({ PORT: 'invalid' })).toThrow(
      'PORT debe ser un puerto TCP válido.',
    );
  });
});
