const VALID_NODE_ENVIRONMENTS = new Set(['development', 'test', 'production']);

export interface ServiceEnvironment {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL?: string;
  RABBITMQ_URL?: string;
}

function validateOptionalUrl(name: string, value: unknown): string | undefined {
  if (value === undefined || value === '') {
    return undefined;
  }

  try {
    return new URL(String(value)).toString();
  } catch {
    throw new Error(`${name} debe ser una URL válida.`);
  }
}

export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> & ServiceEnvironment {
  const nodeEnvironment = String(config.NODE_ENV ?? 'development');
  const port = Number(config.PORT ?? 3001);

  if (!VALID_NODE_ENVIRONMENTS.has(nodeEnvironment)) {
    throw new Error('NODE_ENV debe ser development, test o production.');
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT debe ser un puerto TCP válido.');
  }

  return {
    ...config,
    NODE_ENV: nodeEnvironment,
    PORT: port,
    DATABASE_URL: validateOptionalUrl('DATABASE_URL', config.DATABASE_URL),
    RABBITMQ_URL: validateOptionalUrl('RABBITMQ_URL', config.RABBITMQ_URL),
  };
}
