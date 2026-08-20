const VALID_NODE_ENVIRONMENTS = new Set(['development', 'test', 'production']);

export interface GatewayEnvironment {
  NODE_ENV: string;
  PORT: number;
}

export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> & GatewayEnvironment {
  const nodeEnvironment = String(config.NODE_ENV ?? 'development');
  const port = Number(config.PORT ?? 3000);

  if (!VALID_NODE_ENVIRONMENTS.has(nodeEnvironment)) {
    throw new Error('NODE_ENV debe ser development, test o production.');
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT debe ser un puerto TCP válido.');
  }

  return { ...config, NODE_ENV: nodeEnvironment, PORT: port };
}
